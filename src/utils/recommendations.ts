export type RecommendationProfile = Partial<{
  style: string;
  color: string;
  fit: string;
  budget: string;
}>;

const orderedKeys: Array<keyof RecommendationProfile> = ['style', 'color', 'fit', 'budget'];

function prettyLabel(key: keyof RecommendationProfile): string {
  switch (key) {
    case 'style':
      return 'Style';
    case 'color':
      return 'Color';
    case 'fit':
      return 'Fit';
    case 'budget':
      return 'Budget';
    default:
      return key;
  }
}

export function describeProfile(profile: RecommendationProfile | null | undefined): string {
  if (!profile) return 'No quiz profile saved yet. Complete the quiz first.';

  const parts = orderedKeys
    .filter((key) => typeof profile[key] === 'string' && profile[key]?.trim())
    .map((key) => `${prettyLabel(key)}: ${profile[key]}`);

  if (parts.length === 0) {
    return 'No quiz profile saved yet. Complete the quiz first.';
  }

  return parts.join(' | ');
}
