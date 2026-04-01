export type SharePreviewInput = {
  source: 'wardrobe' | 'recommendations';
  title: string;
  items: Array<{ id: number; name: string }>;
};

export function buildSharePreview(input: SharePreviewInput) {
  return {
    heading: input.title.trim() || 'Shared outfit',
    itemCountLabel: `${input.items.length} item${input.items.length === 1 ? '' : 's'} selected`,
    itemNames: input.items.map((item) => item.name),
    sourceLabel: input.source === 'recommendations' ? 'From recommendations' : 'From wardrobe',
  };
}
