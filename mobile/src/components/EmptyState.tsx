import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';

export function EmptyState({title, message}: {title: string; message?: string}) {
  const theme = useAppTheme();

  return (
    <View style={[styles.box, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
      <AppText weight="bold">{title}</AppText>
      {message ? <AppText muted>{message}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {borderWidth: 1, borderRadius: 8, padding: 18, gap: 6, alignItems: 'center'},
});
