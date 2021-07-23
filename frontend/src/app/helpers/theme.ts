export type ThemeType = 'onLight' | 'onDark';

export const storeThemeValue = (value: boolean) => {
  localStorage.setItem('theme', translateTheme(value) as string);
};

export const getThemeValue = (): boolean => {
  const theme = localStorage.getItem('theme');
  return translateTheme(theme) as boolean;
};

export const getThemeString = (): ThemeType => translateTheme(getThemeValue()) as ThemeType;

export const translateTheme = (theme: boolean | string | null): boolean | ThemeType => {
  if (typeof theme === 'string') {
    return theme === 'onDark';
  }
  return theme ? 'onDark' : 'onLight';
};
