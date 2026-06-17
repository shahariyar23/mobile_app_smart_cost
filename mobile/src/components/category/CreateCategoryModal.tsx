import React, {useState, useEffect} from 'react';
import {Modal, StyleSheet, View, Pressable, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {AppButton} from '@/components/AppButton';
import {AppInput} from '@/components/AppInput';
import {AppText} from '@/components/AppText';
import {IconPicker, PRESET_ICONS} from '@/components/category/IconPicker';
import {ColorPicker, PRESET_COLORS} from '@/components/category/ColorPicker';
import {useAppTheme} from '@/hooks/useAppTheme';
import {Category} from '@/api/categories';
import {TransactionType} from '@/types';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  visible: boolean;
  category?: Category | null;
  saving?: boolean;
  onCancel: () => void;
  onSave: (payload: {name: string; type: TransactionType; icon: string; color: string}) => void;
};

export function CreateCategoryModal({visible, category, saving, onCancel, onSave}: Props) {
  const theme = useAppTheme();
  
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [icon, setIcon] = useState(PRESET_ICONS[0]);
  const [color, setColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    if (visible) {
      if (category) {
        setName(category.name);
        setType(category.type as TransactionType);
        setIcon(category.icon || PRESET_ICONS[0]);
        setColor(category.color || PRESET_COLORS[0]);
      } else {
        setName('');
        setType('expense');
        setIcon(PRESET_ICONS[0]);
        setColor(PRESET_COLORS[0]);
      }
    }
  }, [visible, category]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({name: name.trim(), type, icon, color});
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <KeyboardAvoidingView 
        style={{flex: 1}} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onCancel}>
          <Pressable style={[styles.sheet, {backgroundColor: theme.colors.surface}]} onPress={() => undefined}>
            <View style={styles.header}>
              <AppText variant="subtitle" weight="bold">
                {category ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি তৈরি করুন'}
              </AppText>
              <Pressable onPress={onCancel} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              {/* Preview Card */}
              <View style={[styles.previewCard, {borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceAlt}]}>
                <AppText weight="semibold" style={{marginBottom: 8}}>প্রিভিউ</AppText>
                <View style={[styles.previewContent, {backgroundColor: theme.colors.surface}]}>
                   <View style={[styles.iconContainer, {backgroundColor: 'rgba(0,0,0,0.05)'}]}>
                      <Ionicons name={icon as any} size={24} color={color} />
                   </View>
                   <View style={styles.previewInfo}>
                     <AppText weight="bold" style={{fontSize: 16}}>{name || 'ক্যাটাগরি নাম'}</AppText>
                     <AppText muted variant="caption">{type === 'income' ? 'আয়' : 'খরচ'} ক্যাটাগরি</AppText>
                   </View>
                   <View style={[styles.colorDot, {backgroundColor: color}]} />
                </View>
              </View>

              <AppInput 
                label="ক্যাটাগরির নাম" 
                value={name} 
                onChangeText={setName} 
                placeholder="যেমন: খাবার, যাতায়াত"
              />

              <View>
                <AppText weight="semibold" style={{marginBottom: 8}}>ক্যাটাগরির ধরন</AppText>
                <View style={styles.segment}>
                  <AppButton 
                    title="খরচ" 
                    variant={type === 'expense' ? 'primary' : 'secondary'} 
                    onPress={() => setType('expense')} 
                    style={styles.segmentButton} 
                  />
                  <AppButton 
                    title="আয়" 
                    variant={type === 'income' ? 'primary' : 'secondary'} 
                    onPress={() => setType('income')} 
                    style={styles.segmentButton} 
                  />
                </View>
              </View>

              <IconPicker value={icon} onChange={setIcon} />
              <ColorPicker value={color} onChange={setColor} />

            </ScrollView>

            <View style={[styles.actions, {borderTopColor: theme.colors.border}]}>
              <AppButton title="বাতিল" variant="secondary" onPress={onCancel} style={styles.action} />
              <AppButton 
                title={category ? "আপডেট করুন" : "সেভ করুন"} 
                onPress={handleSave} 
                loading={saving} 
                style={styles.action} 
              />
            </View>

          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end'},
  sheet: {
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  previewCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 1},
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  segment: {flexDirection: 'row', gap: 10},
  segmentButton: {flex: 1},
  actions: {
    flexDirection: 'row', 
    gap: 12, 
    padding: 20,
    borderTopWidth: 1,
  },
  action: {flex: 1},
});
