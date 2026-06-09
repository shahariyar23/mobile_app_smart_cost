import {useColorScheme} from 'react-native';
import {getTheme} from '@/theme/theme';
import {useAppSelector} from '@/store/hooks';

export function useAppTheme() {
  const scheme = useColorScheme();
  const themeMode = useAppSelector(state => state.preferences.themeMode);
  return getTheme(scheme, themeMode === 'system' ? undefined : themeMode);
}
