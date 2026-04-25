import { Platform, TextStyle } from 'react-native';

export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

export const RUBIK_FONTS: Record<FontWeight, string> = {
  regular: 'Rubik_400Regular',
  medium: 'Rubik_500Medium',
  semibold: 'Rubik_600SemiBold',
  bold: 'Rubik_700Bold',
  extrabold: 'Rubik_800ExtraBold',
  black: 'Rubik_900Black',
};

export const textFont = (weight: FontWeight = 'regular', preferSystem: boolean = false): TextStyle => {
  if (preferSystem) {
    return {
      fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
      fontWeight: (weight === 'bold' ? 'bold' : 'normal') as TextStyle['fontWeight'],
    };
  }
  return {
    fontFamily: RUBIK_FONTS[weight] || RUBIK_FONTS.regular,
  };
};
