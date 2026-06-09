import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AppButton} from '@/components/AppButton';
import {AppText} from '@/components/AppText';
import {Screen} from '@/components/Screen';
import {useAppTheme} from '@/hooks/useAppTheme';

export function LandingScreen({navigation}: any) {
  const theme = useAppTheme();

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <AppText variant="title" weight="bold" style={styles.title}>
          স্মার্ট কস্ট
        </AppText>
        <AppText variant="subtitle" style={styles.subtitle}>
          আপনার আয়, খরচ, বাজেট এবং লক্ষ্যের পুরোটা বাংলায় এক জায়গায় পরিচালনা করুন।
        </AppText>
      </View>

      <View style={styles.features}>
        <AppText variant="body" weight="semibold" style={styles.featureItem}>
          • টাকা খরচ ও আয় দ্রুত ট্র্যাক করুন
        </AppText>
        <AppText variant="body" weight="semibold" style={styles.featureItem}>
          • বাজেট তৈরি করে ব্যয় নিয়ন্ত্রণ করুন
        </AppText>
        <AppText variant="body" weight="semibold" style={styles.featureItem}>
          • লক্ষ্য সেট করে সঞ্চয় বাড়ান
        </AppText>
        <AppText variant="body" weight="semibold" style={styles.featureItem}>
          • লেনদেন রিপোর্ট এবং ইনসাইট পান
        </AppText>
      </View>

      <View style={styles.actions}>
        <AppButton title="শুরু করুন" onPress={() => navigation.navigate('Auth')} />
        <AppButton
          title="অ্যাকাউন্ট আছে? লগইন"
          variant="secondary"
          onPress={() => navigation.navigate('Auth')}
          style={[styles.loginButton, {borderColor: theme.colors.border}]}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    lineHeight: 24,
  },
  features: {
    gap: 14,
  },
  featureItem: {
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: 12,
  },
  loginButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
});
