import React from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withRepeat, withTiming} from 'react-native-reanimated';
import {VoiceConfirmationModal} from '@/components/VoiceConfirmationModal';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';
import {useCreateTransaction} from '@/hooks/useTransactions';
import {useVoiceCommand} from '@/hooks/useVoiceCommand';
import {toISODate} from '@/utils/date';

export function GlobalMicButton() {
  const theme = useAppTheme();
  const scale = useSharedValue(1);
  const {isListening, error, draft, start, stop, clearDraft} = useVoiceCommand();
  const createTransaction = useCreateTransaction();

  React.useEffect(() => {
    scale.value = isListening ? withRepeat(withTiming(1.14, {duration: 650}), -1, true) : withTiming(1);
  }, [isListening, scale]);

  React.useEffect(() => {
    if (error) {
      Alert.alert('ভয়েস কমান্ড', error);
    }
  }, [error]);

  const animatedStyle = useAnimatedStyle(() => ({transform: [{scale: scale.value}]}));

  const confirm = () => {
    if (!draft) {
      return;
    }

    createTransaction.mutate(
      {
        type: draft.type,
        amount: draft.amount,
        category: draft.category,
        note: draft.note,
        occurredAt: toISODate(),
      },
      {onSuccess: clearDraft},
    );
  };

  return (
    <>
      <View pointerEvents="box-none" style={styles.wrap}>
        <Animated.View style={animatedStyle}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="ভয়েস দিয়ে লেনদেন যোগ করুন"
            onPress={isListening ? stop : start}
            style={[styles.button, {backgroundColor: isListening ? theme.colors.danger : theme.colors.primary}]}>
            <AppText variant="title" weight="bold" style={styles.icon}>মাইক</AppText>
          </Pressable>
        </Animated.View>
      </View>
      <VoiceConfirmationModal
        draft={draft}
        saving={createTransaction.isPending}
        onCancel={clearDraft}
        onConfirm={confirm}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {position: 'absolute', right: 20, bottom: 26, zIndex: 20},
  button: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
  },
  icon: {color: '#FFFFFF', fontSize: 15, lineHeight: 20},
});
