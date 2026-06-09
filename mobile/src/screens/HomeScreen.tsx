import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '@/components/AppText';
import {AppButton} from '@/components/AppButton';
import {Screen} from '@/components/Screen';
import {useAppTheme} from '@/hooks/useAppTheme';

export function HomeScreen() {
  const theme = useAppTheme();

  return (
    <Screen style={styles.container}>
      <View style={styles.card}>
        <AppText variant="title" weight="bold" style={styles.title}>
          স্বাগতম
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          আপনার ব্যক্তিগত বাজেট, লেনদেন এবং লক্ষ্যের সারাংশ এক জায়গায়।
        </AppText>
        <AppButton title="লেনদেন শুরু করুন" onPress={() => {}} style={[styles.button, {backgroundColor: theme.colors.primary}]} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  card: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 8},
    elevation: 6,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    marginBottom: 24,
  },
  button: {
    alignSelf: 'flex-start',
  },
});
