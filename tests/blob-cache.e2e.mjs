import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { createServer as createNetServer } from 'node:net';

const adminPassword = 'blob-cache-test-password';
const blobs = new Map([
  [
    'tools/config-initial.json',
    JSON.stringify({ edits: {}, added: [], order: ['initial'] }),
  ],
]);
const calls = { list: 0, put: 0, del: 0 };

function blobRecord(origin, pathname, body) {
  const url = `${origin}/content/${encodeURIComponent(pathname)}`;
  return {
    url,
    downloadUrl: `${url}?download=1`,
    pathname,
    size: Buffer.byteLength(body),
    uploadedAt: new Date().toISOString(),
    etag: `etag-${pathname}`,
    contentType: 'application/json',
    contentDisposition: 'inline',
  };
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString();
}

function sendJson(res, value, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(value));
}

const blobServer = createServer(async (req, res) => {
  const origin = `http://${req.headers.host}`;
  const url = new URL(req.url ?? '/', origin);

  if (req.method === 'GET' && url.pathname.startsWith('/content/')) {
    const pathname = decodeURIComponent(url.pathname.slice('/content/'.length));
    const body = blobs.get(pathname);
    if (body === undefined) return sendJson(res, { error: 'not found' }, 404);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(body);
  }

  if (req.method === 'GET' && url.pathname === '/') {
    calls.list += 1;
    const prefix = url.searchParams.get('prefix') ?? '';
    const records = [...blobs.entries()]
      .filter(([pathname]) => pathname.startsWith(prefix))
      .map(([pathname, body]) => blobRecord(origin, pathname, body));
    return sendJson(res, { blobs: records, hasMore: false, cursor: null });
  }

  if (req.method === 'PUT' && url.pathname === '/') {
    calls.put += 1;
    const requestedPathname = url.searchParams.get('pathname') ?? 'unknown';
    const pathname = req.headers['x-add-random-suffix'] === '1'
      ? requestedPathname.replace(/\.json$/, '-test.json')
      : requestedPathname;
    const body = await readBody(req);
    blobs.set(pathname, body);
    return sendJson(res, blobRecord(origin, pathname, body));
  }

  if (req.method === 'POST' && url.pathname === '/delete') {
    calls.del += 1;
    const body = JSON.parse(await readBody(req));
    for (const value of body.urls ?? []) {
      const blobUrl = new URL(value);
      const pathname = decodeURIComponent(blobUrl.pathname.slice('/content/'.length));
      blobs.delete(pathname);
    }
    return sendJson(res, {});
  }

  return sendJson(res, { error: 'unsupported test request' }, 404);
});

async function reservePort() {
  const server = createNetServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert(address && typeof address === 'object');
  const { port } = address;
  server.close();
  await once(server, 'close');
  return port;
}

function waitForReady(child) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Next.js server did not start')), 30_000);
    const onData = (chunk) => {
      if (chunk.toString().includes('Ready')) {
        clearTimeout(timeout);
        child.stdout.off('data', onData);
        resolve();
      }
    };
    child.stdout.on('data', onData);
    child.once('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Next.js server exited with code ${code}`));
    });
  });
}

let app;
try {
  blobServer.listen(0, '127.0.0.1');
  await once(blobServer, 'listening');
  const blobAddress = blobServer.address();
  assert(blobAddress && typeof blobAddress === 'object');

  const appPort = await reservePort();
  const appOrigin = `http://127.0.0.1:${appPort}`;
  app = spawn('./node_modules/.bin/next', ['start', '-p', String(appPort)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ADMIN_PASSWORD: adminPassword,
      BLOB_READ_WRITE_TOKEN: 'vercel_blob_rw_test_token',
      VERCEL_BLOB_API_URL: `http://127.0.0.1:${blobAddress.port}`,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  app.stderr.on('data', (chunk) => process.stderr.write(chunk));
  await waitForReady(app);

  const first = await fetch(`${appOrigin}/api/tools-config`).then((res) => res.json());
  const second = await fetch(`${appOrigin}/api/tools-config`).then((res) => res.json());
  assert.deepEqual(first, second);
  assert.deepEqual(first.config.order, ['initial']);
  assert.equal(calls.list, 1, 'repeated public reads should share one Blob list call');

  const login = await fetch(`${appOrigin}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: adminPassword }),
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie')?.split(';', 1)[0];
  assert(cookie);

  const updated = { edits: {}, added: [], order: ['saved-from-admin'] };
  const save = await fetch(`${appOrigin}/api/admin/tools-config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify(updated),
  });
  assert.equal(save.status, 200);
  assert.equal(calls.put, 1, 'admin save should still write to Blob');

  const afterSave = await fetch(`${appOrigin}/api/tools-config`).then((res) => res.json());
  assert.deepEqual(afterSave.config.order, ['saved-from-admin']);
  assert.equal(calls.list, 3, 'the first read after a save should refill the expired cache');

  await fetch(`${appOrigin}/api/tools-config`);
  assert.equal(calls.list, 3, 'the refilled cache should serve later visitors without listing');

  console.log('Blob cache verified: repeated reads use cache and an admin save refreshes it immediately.');
} finally {
  if (app && app.exitCode === null) {
    app.kill('SIGTERM');
    await once(app, 'exit').catch(() => {});
  }
  blobServer.close();
}
