import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AppButton} from '@/components/AppButton';
import {AppText} from '@/components/AppText';
import {Screen} from '@/components/Screen';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {clearCredentials} from '@/store/slices/authSlice';
import {setThemeMode} from '@/store/slices/preferencesSlice';

export function SettingsScreen() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(state => state.preferences.themeMode);

  return (
    <Screen>
      <AppText variant="title" weight="bold">সেটিংস</AppText>
      <AppText weight="semibold">থিম</AppText>
      <View style={styles.row}>
        <AppButton title="সিস্টেম" variant={mode === 'system' ? 'primary' : 'secondary'} onPress={() => dispatch(setThemeMode('system'))} style={styles.button} />
        <AppButton title="লাইট" variant={mode === 'light' ? 'primary' : 'secondary'} onPress={() => dispatch(setThemeMode('light'))} style={styles.button} />
        <AppButton title="ডার্ক" variant={mode === 'dark' ? 'primary' : 'secondary'} onPress={() => dispatch(setThemeMode('dark'))} style={styles.button} />
      </View>
      <AppButton title="লগআউট" variant="danger" onPress={() => dispatch(clearCredentials())} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: 8},
  button: {flex: 1, minHeight: 44},
});
