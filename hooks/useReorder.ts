'use client';

import { useCallback, useRef, useState } from 'react';
import { moveKeyTo } from '@/lib/reorder';

/**
 * Drag-and-drop / arrow reordering for the admin grids.
 *
 * The pending order lives here until the caller explicitly saves it, so the
 * client can shuffle a whole grid and then apply it in one request.
 *
 * Keys are the ids of every item in the grid — including ones currently hidden
 * by a search or filter, so filtering never drops items from a saved order.
 */

export type DragProps = {
  draggable: true;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
};

export type Reorder = {
  isActive: boolean;
  isDirty: boolean;
  /** Pending order of every key; empty while inactive. */
  order: string[];
  draggingKey: string | null;
  start: (keys: string[]) => void;
  stop: () => void;
  /** Move `key` to where its neighbour `delta` steps away in the visible list sits. */
  move: (key: string, delta: number, visibleKeys: string[]) => void;
  dragProps: (key: string) => DragProps;
};

export function useReorder(): Reorder {
  const [initial, setInitial] = useState<string[] | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [draggingKey, setDraggingKey] = useState<string | null>(null);
  // Mirrors draggingKey for use inside drag handlers, which must read the
  // current value without re-creating every card's props mid-drag.
  const draggingRef = useRef<string | null>(null);

  const start = useCallback((keys: string[]) => {
    setInitial(keys);
    setOrder(keys);
  }, []);

  const stop = useCallback(() => {
    setInitial(null);
    setOrder([]);
    setDraggingKey(null);
    draggingRef.current = null;
  }, []);

  const move = useCallback((key: string, delta: number, visibleKeys: string[]) => {
    const from = visibleKeys.indexOf(key);
    const neighbour = visibleKeys[from + delta];
    if (from < 0 || neighbour === undefined) return;
    setOrder((prev) => moveKeyTo(prev, key, neighbour));
  }, []);

  const dragProps = useCallback(
    (key: string): DragProps => ({
      draggable: true,
      onDragStart: (e) => {
        draggingRef.current = key;
        setDraggingKey(key);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', key); // Firefox won't start a drag without data
      },
      // Reorder live as the card passes over a neighbour, so the drop lands where it looks.
      onDragEnter: (e) => {
        e.preventDefault();
        const dragged = draggingRef.current;
        if (!dragged || dragged === key) return;
        setOrder((prev) => moveKeyTo(prev, dragged, key));
      },
      onDragOver: (e) => e.preventDefault(), // required for the drop to be allowed
      onDrop: (e) => {
        e.preventDefault();
        draggingRef.current = null;
        setDraggingKey(null);
      },
      onDragEnd: () => {
        draggingRef.current = null;
        setDraggingKey(null);
      },
    }),
    []
  );

  return {
    isActive: initial !== null,
    isDirty: initial !== null && initial.join(' ') !== order.join(' '),
    order,
    draggingKey,
    start,
    stop,
    move,
    dragProps,
  };
}
