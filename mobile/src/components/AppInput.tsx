import React from 'react';
import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function AppInput({label, error, style, ...props}: Props) {
  const theme = useAppTheme();

  return (
    <View style={styles.wrap}>
      <AppText weight="semibold">{label}</AppText>
      <TextInput
        placeholderTextColor={theme.colors.muted}
        {...props}
        style={[
          styles.input,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.danger : theme.colors.border,
          },
          style,
        ]}
      />
      {error ? <AppText variant="caption" style={{color: theme.colors.danger}}>{error}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {gap: 8},
  input: {
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 16,
  },
});
