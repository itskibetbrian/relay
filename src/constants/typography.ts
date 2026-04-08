import { Platform } from 'react-native';

export const APP_FONT_FAMILY = Platform.select({
  ios: 'Inter',
  android: 'Inter',
  default: undefined,
});

export const SYSTEM_FONT_FAMILY = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: undefined,
});

export const textFont = (preferSystem: boolean = false) => {
  const fontFamily = preferSystem ? SYSTEM_FONT_FAMILY : APP_FONT_FAMILY;
  return fontFamily ? { fontFamily } : {};
};
