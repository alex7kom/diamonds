import {
  clip,
  getRandomInt,
  applyOpacity,
  getRandomColors,
  getRandomColor,
} from './utils';
import { HSL, LinearGradient, RadialGradient, Layer, Color } from './types';

interface LinearGradientOptions {
  angleMin?: number;
  angleMax?: number;
  min?: number;
  max?: number;
}

interface RadialGradientOptions {
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  min?: number;
  max?: number;
}

interface Options {
  type: 'linear' | 'radial';
  colors?: HSL[];
  randomColorsNumber?: number;
  background?: HSL | 'random';
  shades?: number;
  shadeVariance?: number;
  linearGradientOptions?: LinearGradientOptions;
  radialGradientOptions?: RadialGradientOptions;
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
 * @param opacity Opacity
 * @param options Options
 *
 * @return Gradient data
 */
function createLinearGradient(
  color: HSL,
  opacity = 0.3,
  options: LinearGradientOptions = {}
): LinearGradient {
  const { angleMin = 1, angleMax = 360, min = 5, max = 95 } = options;
  const resultColor = applyOpacity(color, opacity);
  const colorStop = getRandomInt(min, max);

  const gradient: LinearGradient = {
    type: 'LinearGradient',
    angle: getRandomInt(angleMin, angleMax),
    color: resultColor,
    stop: colorStop,
  };

  return gradient;
}

/**
 * @param color Color
 * @param opacity Opacity
 * @param options Options
 *
 * @return Gradient data
 */
function createRadialGradient(
  color: HSL,
  opacity = 0.3,
  options: RadialGradientOptions = {}
): RadialGradient {
  const {
    min = 5,
    max = 20,
    xMin = 0,
    xMax = 100,
    yMin = 0,
    yMax = 100,
  } = options;
  const resultColor = applyOpacity(color, opacity);
  const colorStop = getRandomInt(min, max);

  const gradient: RadialGradient = {
    type: 'RadialGradient',
    x: getRandomInt(xMin, xMax),
    y: getRandomInt(yMin, yMax),
    color: resultColor,
    stop: colorStop,
  };

  return gradient;
}

/**
 * @param color Color
 *
 * @return Background data
 */
function createBackground(color?: HSL): Color {
  return {
    type: 'Color',
    color: color || getRandomColor(),
  };
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
    background,
    shades,
    shadeVariance,
    linearGradientOptions,
    radialGradientOptions,
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

  const layers: Layer[] = allShades.map((color) =>
    type === 'linear'
      ? createLinearGradient(color, opacity, linearGradientOptions)
      : createRadialGradient(color, opacity, radialGradientOptions)
  );

  if (background) {
    layers.push(createBackground());
  }

  return layers;
}
