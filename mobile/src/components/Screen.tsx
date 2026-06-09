import React from 'react';
import {ScrollView, StyleSheet, View, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppTheme} from '@/hooks/useAppTheme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
};

export function Screen({children, scroll = true, style}: Props) {
  const theme = useAppTheme();
  const content = <View style={[styles.content, style]}>{children}</View>;

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      {scroll ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  scroll: {flexGrow: 1},
  content: {flex: 1, padding: 20, gap: 16},
});
