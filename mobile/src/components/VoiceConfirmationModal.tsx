import React from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {AppButton} from '@/components/AppButton';
import {AppText} from '@/components/AppText';
import {categoryLabels} from '@/constants/categories';
import {useAppTheme} from '@/hooks/useAppTheme';
import {VoiceTransactionDraft} from '@/types';
import {formatTaka} from '@/utils/currency';

type Props = {
  draft: VoiceTransactionDraft | null;
  saving?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function VoiceConfirmationModal({draft, saving, onCancel, onConfirm}: Props) {
  const theme = useAppTheme();

  return (
    <Modal visible={!!draft} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={[styles.sheet, {backgroundColor: theme.colors.surface}]} onPress={() => undefined}>
          <AppText variant="subtitle" weight="bold">লেনদেন নিশ্চিত করুন</AppText>
          {draft ? (
            <View style={styles.details}>
              <Row label="ধরন" value={draft.type === 'income' ? 'আয়' : 'খরচ'} />
              <Row label="পরিমাণ" value={formatTaka(draft.amount)} />
              <Row label="ক্যাটাগরি" value={categoryLabels[draft.category]} />
              <Row label="ভয়েস" value={draft.transcript} />
            </View>
          ) : null}
          <View style={styles.actions}>
            <AppButton title="বাতিল" variant="secondary" onPress={onCancel} style={styles.action} />
            <AppButton title="সেভ করুন" onPress={onConfirm} loading={saving} style={styles.action} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.row}>
      <AppText muted>{label}</AppText>
      <AppText weight="semibold" style={styles.rowValue}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end'},
  sheet: {borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 20, gap: 16},
  details: {gap: 10},
  row: {flexDirection: 'row', justifyContent: 'space-between', gap: 12},
  rowValue: {flex: 1, textAlign: 'right'},
  actions: {flexDirection: 'row', gap: 12},
  action: {flex: 1},
});
