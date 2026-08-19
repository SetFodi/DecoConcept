export const PRODUCT_LOCALES = ['ka', 'en', 'ru'] as const;

export type ProductLocale = (typeof PRODUCT_LOCALES)[number];

export type ProductCopy = {
  title: string;
  description: string;
};

export type RoyalPaintProduct = {
  id: string;
  image: string;
  copy: Record<ProductLocale, ProductCopy>;
};

export type RoyalPaintProductsConfig = {
  products: RoyalPaintProduct[];
};

export const defaultRoyalPaintProductsConfig: RoyalPaintProductsConfig = {
  products: [
    {
      id: 'supreme',
      image: '/images/royal-paint/showcase-supreme.jpeg',
      copy: {
        ka: {
          title: 'Supreme',
          description: 'აკრილ-სილოქსანური ექსტერიერის საღებავი სუნთქვადი და წყალგაუმტარი დაცვით.',
        },
        en: {
          title: 'Supreme',
          description: 'Acrylic-siloxane exterior paint with breathable, water-repellent protection.',
        },
        ru: {
          title: 'Supreme',
          description: 'Акрил-силоксановая фасадная краска с дышащей водоотталкивающей защитой.',
        },
      },
    },
    {
      id: 'silk-finish',
      image: '/images/royal-paint/showcase-silk-finish.jpeg',
      copy: {
        ka: {
          title: 'Silk Finish',
          description: 'სატინის ეფექტის ინტერიერის კედლის საღებავი გლუვი, რეცხვადი ზედაპირით.',
        },
        en: {
          title: 'Silk Finish',
          description: 'Satin-finish interior wall paint with a smooth, washable surface.',
        },
        ru: {
          title: 'Silk Finish',
          description: 'Интерьерная краска с гладким моющимся покрытием и сатиновым блеском.',
        },
      },
    },
    {
      id: 'egg-shell',
      image: '/images/royal-paint/showcase-egg-shell.jpeg',
      copy: {
        ka: {
          title: 'Egg Shell',
          description: 'სატინის ეფექტის კედლის ემალი ინტერიერისთვის, ელეგანტური ნახევრად პრიალა დასრულებით.',
        },
        en: {
          title: 'Egg Shell',
          description: 'Satin wall enamel for interior walls with an elegant semi-gloss finish.',
        },
        ru: {
          title: 'Egg Shell',
          description: 'Сатиновая эмаль для внутренних стен с элегантным полуглянцевым финишем.',
        },
      },
    },
    {
      id: 'fast-clean',
      image: '/images/royal-paint/showcase-fast-clean.jpeg',
      copy: {
        ka: {
          title: 'Fast Clean',
          description: 'მქრქალი კედლის საღებავი, რომელიც ლაქების მარტივ წმენდას ფენის დაზიანების გარეშე უზრუნველყოფს.',
        },
        en: {
          title: 'Fast Clean',
          description: 'Matte wall paint made for easy stain cleaning without damaging the finish.',
        },
        ru: {
          title: 'Fast Clean',
          description: 'Матовая краска для стен, созданная для легкого удаления пятен без повреждения покрытия.',
        },
      },
    },
  ],
};

function isProductCopy(value: unknown): value is ProductCopy {
  if (!value || typeof value !== 'object') return false;
  const copy = value as Record<string, unknown>;
  return (
    typeof copy.title === 'string' &&
    copy.title.length <= 200 &&
    typeof copy.description === 'string' &&
    copy.description.length <= 2_000
  );
}

function isProduct(value: unknown): value is RoyalPaintProduct {
  if (!value || typeof value !== 'object') return false;
  const product = value as Record<string, unknown>;
  if (typeof product.id !== 'string' || !/^[a-z0-9][a-z0-9-]{0,99}$/.test(product.id)) {
    return false;
  }
  if (typeof product.image !== 'string' || product.image.length === 0 || product.image.length > 2_000) {
    return false;
  }
  if (!product.copy || typeof product.copy !== 'object') return false;
  const copy = product.copy as Record<string, unknown>;
  return PRODUCT_LOCALES.every((locale) => isProductCopy(copy[locale]));
}

export function isRoyalPaintProductsConfig(value: unknown): value is RoyalPaintProductsConfig {
  if (!value || typeof value !== 'object') return false;
  const config = value as Record<string, unknown>;
  if (!Array.isArray(config.products) || config.products.length > 100) return false;
  if (!config.products.every(isProduct)) return false;
  const ids = config.products.map((product) => product.id);
  return new Set(ids).size === ids.length;
}

export function getProductCopy(
  product: RoyalPaintProduct,
  locale: string
): ProductCopy {
  const requested = PRODUCT_LOCALES.includes(locale as ProductLocale)
    ? product.copy[locale as ProductLocale]
    : product.copy.en;
  const copies = [requested, product.copy.en, product.copy.ka, product.copy.ru];
  return {
    title: requested.title.trim() || copies.find((copy) => copy.title.trim())?.title || '',
    description:
      requested.description.trim() ||
      copies.find((copy) => copy.description.trim())?.description ||
      '',
  };
}
