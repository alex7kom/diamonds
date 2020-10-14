import { clip, getRandomInt, applyOpacity, getRandomColors } from './utils';
import { HSL, LinearGradient, RadialGradient, Layer } from './types';

interface Options {
  type: 'linear' | 'radial';
  colors?: HSL[];
  randomColorsNumber?: number;
  shades?: number;
  shadeVariance?: number;
  linearAngle?: number;
  opacity?: number;
}

/**
 * @param color Color
 * @param shadeVariance Maximum deviation from original color
 *
 * @return Color
 */
function createColorShade(color: HSL, shadeVariance: number): HSL {
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
function createColorShades(color: HSL, shades: number, shadeVariance: number) {
  const outputColors: HSL[] = [];

  for (let i = 0; i < shades; i++) {
    outputColors.push(createColorShade(color, shadeVariance));
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
function createLinearGradient(
  color: HSL,
  angle: number | undefined,
  opacity = 0.3
): LinearGradient {
  const resultColor = applyOpacity(color, opacity);
  const colorStop = getRandomInt(0, 100);

  const gradient: LinearGradient = {
    type: 'LinearGradient',
    angle: angle || getRandomInt(1, 360),
    color: resultColor,
    stop: colorStop,
  };

  return gradient;
}

/**
 * @param color Color
 * @param opacity Opacity
 *
 * @return Gradient data
 */
function createRadialGradient(color: HSL, opacity = 0.3): RadialGradient {
  const resultColor = applyOpacity(color, opacity);
  const colorStop = getRandomInt(5, 20);

  const gradient: RadialGradient = {
    type: 'RadialGradient',
    x: getRandomInt(0, 100),
    y: getRandomInt(0, 100),
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
export function createDiamonds(options: Options): Layer[] {
  const {
    type,
    colors: inputColors,
    randomColorsNumber,
    shades,
    shadeVariance,
    linearAngle,
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
      const colorShades = createColorShades(
        allColors[i],
        shades,
        shadeVariance
      );

      allShades.push(...colorShades);
    }
  }

  const gradients: Layer[] = allShades.map((color) =>
    type === 'linear'
      ? createLinearGradient(color, linearAngle, opacity)
      : createRadialGradient(color, opacity)
  );

  return gradients;
}
