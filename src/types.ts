export type HSL = [
  hue: number,
  saturation: number,
  luminance: number,
  alpha: number
];

export interface LinearGradient {
  type: 'LinearGradient';
  angle: number;
  color: HSL;
  stop: number;
}

export interface RadialGradient {
  type: 'RadialGradient';
  x: number;
  y: number;
  color: HSL;
  stop: number;
}

export type Layer = LinearGradient | RadialGradient;
