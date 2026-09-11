export const SIZE_DISPLAY_MAP: Record<string, string> = {
  'XS': '0',
  'S': '2',
  'M': '4',
  'L': '6',
  'XL': '8',
  'XXL': '10',
};

export function formatSizeLabel(size?: string): string {
  if (!size) return '';
  const trimmed = size.trim().toUpperCase();
  return SIZE_DISPLAY_MAP[trimmed] || size;
}
