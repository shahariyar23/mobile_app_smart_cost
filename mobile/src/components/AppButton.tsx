import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, ViewStyle} from 'react-native';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
};

export function AppButton({title, onPress, loading, variant = 'primary', style}: Props) {
  const theme = useAppTheme();
  const backgroundColor =
    variant === 'primary'
      ? theme.colors.primary
      : variant === 'danger'
        ? theme.colors.danger
        : theme.colors.surfaceAlt;
  const color = variant === 'secondary' ? theme.colors.text : '#FFFFFF';

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({pressed}) => [styles.button, {backgroundColor, opacity: pressed ? 0.88 : 1}, style]}>
      {loading ? <ActivityIndicator color={color} /> : <AppText weight="semibold" style={{color}}>{title}</AppText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
});
