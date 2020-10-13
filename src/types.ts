export type HSL = [
  hue: number,
  saturation: number,
  luminance: number,
  alpha: number
];

export interface Gradient {
  angle: number;
  color: HSL;
  stop: number;
}
