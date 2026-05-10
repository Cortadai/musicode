import type { PaletteConfig, PaletteName } from '../types';
import { indigoPalette } from './indigo';
import { zincPalette } from './zinc';
import { crimsonPalette } from './crimson';
import { emeraldPalette } from './emerald';
import { amberPalette } from './amber';
import { cyanPalette } from './cyan';
import { daylightPalette } from './daylight';
import { sunrisePalette } from './sunrise';
import { frostPalette } from './frost';

export const palettes: Record<PaletteName, PaletteConfig> = {
  indigo: indigoPalette,
  zinc: zincPalette,
  crimson: crimsonPalette,
  emerald: emeraldPalette,
  amber: amberPalette,
  cyan: cyanPalette,
  daylight: daylightPalette,
  sunrise: sunrisePalette,
  frost: frostPalette,
};

export { indigoPalette } from './indigo';
export { zincPalette } from './zinc';
export { crimsonPalette } from './crimson';
export { emeraldPalette } from './emerald';
export { amberPalette } from './amber';
export { cyanPalette } from './cyan';
export { daylightPalette } from './daylight';
export { sunrisePalette } from './sunrise';
export { frostPalette } from './frost';
