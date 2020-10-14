import { HSL, Gradient } from './types';

/**
 * Convert color value with HSL type to CSS string
 *
 * @param color HSL color
 *
 * @return CSS representation of HSL color
 */
function HSLtoString(color: HSL): string {
  const [h, s, l, a] = color;

  return `hsla(${h}, ${s}%, ${l}%, ${a.toFixed(2)})`;
}

/**
 * @param data Gradient data
 *
 * @return Gradient CSS string
 */
function buildLinearGradient(data: Gradient): string {
  const { angle, color, stop } = data;

  return `linear-gradient(${angle}deg, ${HSLtoString(
    color
  )} ${stop}%, transparent ${stop}%)`;
}

/**
 * @param gradients Raw gradients
 *
 * @return Array of CSS strings
 */
export function renderCSSGradients(gradients: Gradient[]): string[] {
  return gradients.map(buildLinearGradient);
}
