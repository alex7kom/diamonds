import { HSL, Gradient } from './types';

export { renderCSSGradients } from './css';

interface Options {
  colors?: HSL[];
  randomColorsNumber?: number;
  shades?: number;
  shadeVariance?: number;
  angle?: number;
  opacity?: number;
}

/**
 * Get a random integer between two values, inclusive
 *
 * @param min Minimum number
 * @param max Maximum number
 *
 * @return Random integer number
 */
function getRandomInt(min: number, max: number): number {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);

  return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
}

/**
 * @return Random color in HSL
 */
function getRandomColor(): HSL {
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
function clip(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * @param color Color
 * @param shadeVariance Maximum deviation from original color
 *
 * @return Color
 */
function getColorShade(color: HSL, shadeVariance: number): HSL {
  const [h, s, l, a] = color;

  const saturation = clip(
    s + getRandomInt(0, shadeVariance) - getRandomInt(0, shadeVariance),
    0,
    100
  );

  const luminance = clip(
    l + getRandomInt(0, shadeVariance) - getRandomInt(0, shadeVariance),
    0,
    100
  );

  return [h, saturation, luminance, a];
}

/**
 * @param color Color
 * @param shades Number of shades to generate
 * @param shadeVariance Maximum deviation from original color
 *
 * @return Color shades
 */
function getColorShades(color: HSL, shades: number, shadeVariance: number) {
  const outputColors: HSL[] = [];

  for (let i = 0; i < shades; i++) {
    outputColors.push(getColorShade(color, shadeVariance));
  }

  return outputColors;
}

/**
 * @param color Color
 * @param angle Angle
 * @param opacity Opacity
 *
 * @return Gradient data
 */
function buildGradient(
  color: HSL,
  angle: number | undefined,
  opacity = 0.3
): Gradient {
  const resultColor = applyOpacity(color, opacity);
  const colorStop = getRandomInt(0, 100);

  const gradient: Gradient = {
    angle: angle || getRandomInt(1, 360),
    color: resultColor,
    stop: colorStop,
  };

  return gradient;
}

/**
 * @param options options
 *
 * @return Raw array of gradient data
 */
export function createDiamonds(options: Options): Gradient[] {
  const {
    colors: inputColors,
    randomColorsNumber,
    shades,
    shadeVariance,
    angle,
    opacity,
  } = options;

  if (!inputColors && !randomColorsNumber) {
    throw new Error('Please provide colors or random colors number');
  }

  const colors = inputColors || [];

  const randomColors = getRandomColors(randomColorsNumber || 0);

  const allColors = [...colors, ...randomColors];

  const allShades = [...allColors];

  if (shades && typeof shadeVariance !== 'undefined') {
    for (let i = 0; i < allColors.length; i++) {
      const colorShades = getColorShades(allColors[i], shades, shadeVariance);

      allShades.push(...colorShades);
    }
  }

  const gradients = allShades.map((color) =>
    buildGradient(color, angle, opacity)
  );

  return gradients;
}
