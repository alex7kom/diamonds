import { HSL } from './types';

/**
 * Get a random integer between two values, inclusive
 *
 * @param min Minimum number
 * @param max Maximum number
 *
 * @return Random integer number
 */
export function getRandomInt(min: number, max: number): number {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);

  return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
}

/**
 * @return Random color in HSL
 */
export function getRandomColor(): HSL {
  return [getRandomInt(0, 360), getRandomInt(0, 100), getRandomInt(0, 100), 1];
}

/**
 * @param colorsNum Number of colors to generate
 *
 * @return An array of random colors
 */
export function getRandomColors(colorsNum: number): HSL[] {
  return Array(colorsNum).fill(0).map(getRandomColor);
}

/**
 * @param color Color
 * @param opacity Opacity
 *
 * @return Color with specified opacity
 */
export function applyOpacity(color: HSL, opacity: number): HSL {
  const [h, s, l] = color;

  return [h, s, l, opacity];
}

/**
 * @param value Value to clip
 * @param min Minimum value
 * @param max Maximum value
 *
 * @return Value
 */
export function clip(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
