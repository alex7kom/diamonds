import { HSL, LinearGradient, RadialGradient, Layer } from './types';

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
 * Build linear gradient
 *
 * @param data Gradient data
 *
 * @return Gradient CSS string
 */
function buildLinearGradient(data: LinearGradient): string {
  const { angle, color, stop } = data;

  return `linear-gradient(${angle}deg, ${HSLtoString(
    color
  )} ${stop}%, transparent ${stop}%)`;
}

/**
 * Build radial gradient
 *
 * @param data Gradient data
 *
 * @return Gradient CSS string
 */
function buildRadialGradient(data: RadialGradient): string {
  const { x, y, color, stop } = data;

  return `radial-gradient(circle at ${x}% ${y}%, ${HSLtoString(
    color
  )} ${stop}%, transparent ${stop}%)`;
}

/**
 * @param layer Layer data
 *
 * @return Gradient CSS string
 */
function buildLayer(layer: Layer): string {
  if (layer.type === 'LinearGradient') {
    return buildLinearGradient(layer);
  }

  if (layer.type === 'RadialGradient') {
    return buildRadialGradient(layer);
  }

  if (layer.type === 'Color') {
    return HSLtoString(layer.color);
  }

  throw new Error('Unknown layer type');
}

/**
 * @param layers Raw layer data
 *
 * @return Array of CSS strings
 */
function renderCSSLayers(layers: Layer[]): string[] {
  return layers.map(buildLayer);
}

/**
 * @param layers Raw layer data
 *
 * @return Set of gradient or color layers
 */
export function renderCSS(layers: Layer[]): string {
  return renderCSSLayers(layers).join(', ');
}
