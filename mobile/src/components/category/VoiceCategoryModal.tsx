import React from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {AppButton} from '@/components/AppButton';
import {AppText} from '@/components/AppText';
import {useAppTheme} from '@/hooks/useAppTheme';
import {TransactionType} from '@/types';

export type VoiceCategoryDraft = {
  transcript: string;
  name: string;
  type: TransactionType;
};

type Props = {
  draft: VoiceCategoryDraft | null;
  saving?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onEdit: () => void;
};

export function VoiceCategoryModal({draft, saving, onCancel, onConfirm, onEdit}: Props) {
  const theme = useAppTheme();

  return (
    <Modal visible={!!draft} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={[styles.sheet, {backgroundColor: theme.colors.surface}]} onPress={() => undefined}>
          <AppText variant="subtitle" weight="bold">ক্যাটাগরি তৈরি নিশ্চিত করুন</AppText>
          {draft ? (
            <View style={styles.details}>
              <Row label="ক্যাটাগরির নাম" value={draft.name} />
              <Row label="ধরন" value={draft.type === 'income' ? 'আয়' : 'খরচ'} />
              <Row label="ভয়েস কমান্ড" value={draft.transcript} />
            </View>
          ) : null}
          <View style={styles.actions}>
            <AppButton title="এডিট" variant="secondary" onPress={onEdit} style={styles.action} />
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
