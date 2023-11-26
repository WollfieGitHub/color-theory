export type PixelPos = { x: number; y: number };
export type RGB = { r: number; g: number; b: number };
export type LAB = { l: number; a: number; b: number };


export type ColorZoneResult = Map<string, PixelPos[]>;

export type StaticImageData = string