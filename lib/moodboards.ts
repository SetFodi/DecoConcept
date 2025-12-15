export type MoodboardKind = 'flatlay' | 'interior' | 'detail' | 'moodboard';
export type MoodboardOrientation = 'portrait' | 'landscape';

export type MoodboardImage = {
  src: string;
  title: string;
  kind: MoodboardKind;
  orientation: MoodboardOrientation;
};

function titleFromFilename(filename: string): string {
  const noExt = filename.replace(/\.[^.]+$/, '');
  return noExt
    .replace(/^Flatlay[_ ]/i, '')
    .replace(/^vertical[_ ]/i, '')
    .replace(/^Vertical[_ ]/i, '')
    .replace(/^B&MLG[_ ]/i, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function createImage(
  filename: string,
  kind: MoodboardKind,
  orientation: MoodboardOrientation
): MoodboardImage {
  return {
    src: `/images/moodboards/${filename}`,
    title: titleFromFilename(filename),
    kind,
    orientation
  };
}

// Keep this list in sync with `public/images/moodboards`.
// We intentionally keep it explicit so the UI is predictable and easy to curate.
export const moodboardImages: MoodboardImage[] = [
  // Curated order: interleave Flatlays with “matching” inspiration photos (similar color feel)
  // so the grid reads as intentional sets instead of blocks of similar content.

  // Yellow set
  createImage('Flatlay_B&MLG_Bassoon.jpg', 'flatlay', 'landscape'),
  createImage('Citrine 71, Sky Blue 103, Portland Stone Light 281.jpg', 'moodboard', 'landscape'),
  createImage('Flatlay_vertical_B&MLG_Bassoon.jpg', 'flatlay', 'portrait'),

  // Random break
  createImage('Jewel Beetle 303 - Detail.jpg', 'detail', 'landscape'),

  // Blue set
  createImage('Flatlay_B&MLG_Royal_Navy.jpg', 'flatlay', 'landscape'),
  createImage('Deep Space Blue, Mid Azure Green, Dock Blue.jpg', 'moodboard', 'landscape'),
  createImage('Flatlay_vertical_B&MLG_Royal_Navy.jpg', 'flatlay', 'portrait'),
  createImage('Ultra Blue 264-Linen Wash.jpg', 'moodboard', 'landscape'),

  // Random break
  createImage('Lamp Black 228 Detail.jpg', 'detail', 'landscape'),

  // Purple / warm set
  createImage('Flatlay_B&MLG_Purple_Brown.jpg', 'flatlay', 'landscape'),
  createImage('Cordoba, Purple Brown, Scullery.jpg', 'moodboard', 'landscape'),
  createImage('Flatlay_Vertical_B&MLG_Purple_Brown.jpg', 'flatlay', 'portrait'),

  // Random break
  createImage('Ashes of Roses 6.jpg', 'interior', 'landscape'),

  // Teal / green set
  createImage('Flatlay_B&MLG_Aquamarine.jpg', 'flatlay', 'landscape'),
  createImage('Dock Blue 252, Three Farm Green 306.jpg', 'moodboard', 'landscape'),
  createImage('Flatlay_vertical_B&MLG_Aquamarine.jpg', 'flatlay', 'portrait'),
  createImage('Mid Azure Green 96.jpg', 'interior', 'landscape'),

  // Random break
  createImage('Chocolate Colour 124.jpg', 'interior', 'landscape'),

  // Neutral set
  createImage('Flatlay_B&MLG_French_Grey.jpg', 'flatlay', 'landscape'),
  createImage('Scree 227, Slaked Lime 105.jpg', 'moodboard', 'landscape'),
  createImage('Flatlay_vertical_B&MLG_French_Grey.jpg', 'flatlay', 'portrait'),
  createImage('Lead Colour 117 - Bedroom.jpg', 'interior', 'landscape'),

  // Green / soft set
  createImage('Flatlay_B&MLG_Rolling_fog.jpg', 'flatlay', 'landscape'),
  createImage('Olive Colour 72, Basalt 221.jpg', 'moodboard', 'landscape'),

  // Remaining images (still curated, but looser)
  createImage('Obsidian Green 216.jpg', 'interior', 'landscape'),
  createImage('Obsidian Green 216 Detail.jpg', 'detail', 'landscape'),

  createImage('Flatlay_B&MLG_Livid.jpg', 'flatlay', 'landscape'),
  createImage('Garden 86, Scullery 318, Pea Green 91.jpg', 'moodboard', 'landscape'),
  createImage('Flatlay_vertical_B&MLG_Livid.jpg', 'flatlay', 'portrait'),

  createImage('Jewel Beetle 303.jpg', 'interior', 'landscape'),

  createImage('Flatlay_B&MLG_Chemise.jpg', 'flatlay', 'landscape'),
  createImage('Flatlay_vertical_B&MLG_Chemise.jpg', 'flatlay', 'portrait'),

  createImage('Mazarine 256, Air Force Blue 260, Ultra Blue 264.jpg', 'moodboard', 'landscape'),
  createImage('Thai Saphire 116.jpg', 'interior', 'landscape'),
  createImage('Adventurer 7.jpg', 'interior', 'landscape'),
  createImage('Atomic Red 190, Brighton 203.jpg', 'moodboard', 'landscape'),
  createImage('Flatlay_Vertical_B&MLG_Rolling_Fog.jpg', 'flatlay', 'portrait')
];

export function countMoodboardsByKind(images: MoodboardImage[]): Record<MoodboardKind, number> {
  return images.reduce(
    (acc, img) => {
      acc[img.kind] += 1;
      return acc;
    },
    { flatlay: 0, interior: 0, detail: 0, moodboard: 0 } as Record<MoodboardKind, number>
  );
}


