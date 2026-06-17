import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AppText} from '@/components/AppText';
import {AppButton} from '@/components/AppButton';

interface EmptyBudgetStateProps {
  onCreateBudget: () => void;
  onVoiceInput: () => void;
}

export function EmptyBudgetState({
  onCreateBudget,
  onVoiceInput,
}: EmptyBudgetStateProps) {
  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustration}>
        <AppText style={styles.illustrationIcon}>💰</AppText>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <AppText weight="bold" style={styles.title}>
          প্রথম বাজেট তৈরি করুন
        </AppText>
        <AppText style={styles.description}>
          আপনার খরচ নিয়ন্ত্রণ করতে এবং আর্থিক লক্ষ্য অর্জনে একটি বাজেট সেট করুন।
        </AppText>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <AppButton
          title="বাজেট তৈরি করুন"
          onPress={onCreateBudget}
          style={styles.primaryButton}
        />
        <AppButton
          title="ভয়েস দ্বারা তৈরি করুন"
          onPress={onVoiceInput}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 32,
  },
  illustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
  },
  illustrationIcon: {
    fontSize: 56,
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    marginBottom: 8,
  },
});
