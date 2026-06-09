import {ColorSchemeName} from 'react-native';

export type AppTheme = {
  mode: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    muted: string;
    border: string;
    primary: string;
    primarySoft: string;
    danger: string;
    success: string;
    warning: string;
  };
};

const light: AppTheme = {
  mode: 'light',
  colors: {
    background: '#F6F7F4',
    surface: '#FFFFFF',
    surfaceAlt: '#EEF3EA',
    text: '#17211B',
    muted: '#66756B',
    border: '#D9E1D7',
    primary: '#0F766E',
    primarySoft: '#DDF5F1',
    danger: '#D14343',
    success: '#168A4A',
    warning: '#B7791F',
  },
};

const dark: AppTheme = {
  mode: 'dark',
  colors: {
    background: '#111611',
    surface: '#1A211B',
    surfaceAlt: '#202A22',
    text: '#F4F7F2',
    muted: '#A8B3A8',
    border: '#314033',
    primary: '#45C4B0',
    primarySoft: '#123A35',
    danger: '#FF6B6B',
    success: '#55D187',
    warning: '#F2B84B',
  },
};

export function getTheme(scheme: ColorSchemeName, override?: 'light' | 'dark') {
  if (override) {
    return override === 'dark' ? dark : light;
  }

  return scheme === 'dark' ? dark : light;
}
