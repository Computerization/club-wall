import type { Club } from './clubs';

/**
 * Selection probabilities for the "Surprise Me" random pick, keyed by club id.
 *
 * Each listed club is chosen at exactly its stated probability (0–1). Whatever
 * probability is left over — `1 - (sum of listed weights)` — is split equally
 * among every club that is NOT listed here. So to spotlight a few clubs, give
 * them a weight; everyone else stays uniformly random over the remainder.
 *
 * Keep the sum of listed weights ≤ 1, otherwise the unlisted clubs never appear.
 */
export const clubWeights: Record<string, number> = {
  "40": 0.12, // Computerization
  "64": 0.1, // AI Lab
  "3": 0.1, // Frisbee
};

/**
 * Picks a club honoring `clubWeights`: listed clubs at their exact probability,
 * the rest sharing the leftover probability equally.
 */
export function pickWeightedClub(
  clubs: Club[],
  weights: Record<string, number> = clubWeights,
): Club | undefined {
  if (clubs.length === 0) return undefined;

  const weighted = clubs.filter((c) => typeof weights[c.id] === 'number');
  const unweighted = clubs.filter((c) => typeof weights[c.id] !== 'number');

  const weightedSum = weighted.reduce((sum, c) => sum + weights[c.id], 0);
  const remaining = Math.max(0, 1 - weightedSum);
  const perUnweighted = unweighted.length > 0 ? remaining / unweighted.length : 0;

  const r = Math.random();
  let acc = 0;
  for (const c of weighted) {
    acc += weights[c.id];
    if (r < acc) return c;
  }
  for (const c of unweighted) {
    acc += perUnweighted;
    if (r < acc) return c;
  }

  // Floating-point safety net: weights summed just shy of 1 — return the last club.
  return clubs[clubs.length - 1];
}
