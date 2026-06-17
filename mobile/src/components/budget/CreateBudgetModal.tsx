import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  useColorScheme,
} from 'react-native';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {budgetsApi} from '@/api/budgets';
import {categoryLabels} from '@/constants/categories';
import {useQuery} from '@tanstack/react-query';
import {categoriesApi, Category as ApiCategory} from '@/api/categories';
import {AppText} from '@/components/AppText';
import {AppButton} from '@/components/AppButton';
import {AppInput} from '@/components/AppInput';

const schema = z.object({
  month: z.string().min(7),
  amount: z.coerce.number().positive(),
  alertThreshold: z.coerce.number().min(1).max(100),
  category_id: z.union([z.number().nullable(), z.undefined()]),
});

type FormValues = z.infer<typeof schema>;

interface CreateBudgetModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (values: FormValues) => void;
}

export function CreateBudgetModal({
  visible,
  onClose,
  onSuccess,
}: CreateBudgetModalProps) {
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const isDark = colorScheme === 'dark';
  const [showCategoryPicker, setShowCategoryPicker] = React.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | undefined>(undefined);

  const colors = isDark
    ? {
        bg: '#0F1419',
        surface: '#1A1F2E',
        border: '#2D3748',
        text: '#FFFFFF',
        textMuted: '#A0AEC0',
      }
    : {
        bg: '#FFFFFF',
        surface: '#F9FAFB',
        border: '#E5E7EB',
        text: '#111827',
        textMuted: '#6B7280',
      };

  const {control, handleSubmit, setValue} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      month: new Date().toISOString().slice(0, 7),
      amount: 30000,
      alertThreshold: 80,
      category_id: undefined,
    },
  });

  const {data: categories} = useQuery<ApiCategory[]>({
    queryKey: ['categories', 'list'],
    queryFn: categoriesApi.list,
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => budgetsApi.upsert(values as any),
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['budget', 'current']});
      queryClient.invalidateQueries({queryKey: ['budgets', 'list']});
      onSuccess({
        month: data.month || new Date().toISOString().slice(0, 7),
        amount: data.amount || 0,
        alertThreshold: data.alertThreshold || 80,
      });
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Pressable onPress={onClose} style={styles.closeButton}>
            <AppText style={styles.closeIcon}>✕</AppText>
          </Pressable>
          <AppText weight="bold" style={[styles.headerTitle, {color: colors.text}]}>
            বাজেট তৈরি করুন
          </AppText>
          <View style={{width: 40}} />
        </View>

        {/* Content */}
        <ScrollView
          style={[styles.content, {backgroundColor: colors.bg}]}
          contentContainerStyle={styles.contentInner}
        >
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <AppText
                weight="bold"
                style={[styles.label, {color: colors.text}]}
              >
                মাস নির্বাচন করুন
              </AppText>
              <Controller
                control={control}
                name="month"
                render={({field}) => (
                  <AppInput
                    label="মাস"
                    value={field.value}
                    onChangeText={field.onChange}
                    placeholder="YYYY-MM"
                  />
                )}
              />
            </View>

            <View style={styles.formGroup}>
              <AppText
                weight="bold"
                style={[styles.label, {color: colors.text}]}
              >
                মাসিক বাজেট
              </AppText>
              <Controller
                control={control}
                name="amount"
                render={({field}) => (
                  <AppInput
                    label="বাজেট পরিমাণ"
                    keyboardType="numeric"
                    value={String(field.value || '')}
                    onChangeText={(val) =>
                      field.onChange(parseFloat(val) || 0)
                    }
                    placeholder="30000"
                  />
                )}
              />
              <AppText style={[styles.helperText, {color: colors.textMuted}]}>
                আপনার মাসিক খরচের সীমা নির্ধারণ করুন
              </AppText>
            </View>

            <View style={styles.formGroup}>
              <AppText
                weight="bold"
                style={[styles.label, {color: colors.text}]}
              >
                বিভাগ নির্বাচন করুন
              </AppText>
              <Controller
                control={control}
                name="category_id"
                render={({field}) => (
                  <View style={styles.categorySelect}>
                    <AppButton
                      title={
                        field.value
                          ? (categories?.find((c) => c.id === field.value)?.name ?? 'অজ্ঞাত')
                          : 'সকল বিভাগ (ডিফল্ট)'
                      }
                      onPress={() => {
                        setSelectedCategoryId(field.value);
                        setShowCategoryPicker(true);
                      }}
                    />
                  </View>
                )}
              />
              <AppText style={[styles.helperText, {color: colors.textMuted}]}>
                একটি বিভাগ বেছে নিন অথবা সকল বিভাগের জন্য বাজেট তৈরি করুন
              </AppText>
            </View>

            <View style={styles.formGroup}>
              <AppText
                weight="bold"
                style={[styles.label, {color: colors.text}]}
              >
                সতর্কতা সীমা
              </AppText>
              <Controller
                control={control}
                name="alertThreshold"
                render={({field}) => (
                  <AppInput
                    label="সতর্কতা সীমা (%)"
                    keyboardType="numeric"
                    value={String(field.value || '')}
                    onChangeText={(val) =>
                      field.onChange(parseInt(val) || 80)
                    }
                    placeholder="80"
                  />
                )}
              />
              <AppText style={[styles.helperText, {color: colors.textMuted}]}>
                এই শতাংশে পৌঁছালে আপনি সতর্কতা পাবেন
              </AppText>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
            },
          ]}
        >
          <AppButton
            title="বাতিল করুন"
            variant="secondary"
            onPress={onClose}
            style={styles.footerButton}
          />
          <AppButton
            title="বাজেট তৈরি করুন"
            onPress={handleSubmit((values) => mutation.mutate(values))}
            loading={mutation.isPending}
            style={styles.footerButton}
          />
        </View>
      </View>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <View style={styles.categoryPickerContainer}>
          <View
            style={[
              styles.categoryPickerContent,
              {backgroundColor: colors.surface},
            ]}
          >
            {/* Header */}
            <View
              style={[
                styles.categoryPickerHeader,
                {borderBottomColor: colors.border},
              ]}
            >
              <AppText
                weight="bold"
                style={[styles.categoryPickerTitle, {color: colors.text}]}
              >
                বিভাগ নির্বাচন করুন
              </AppText>
              <Pressable
                onPress={() => setShowCategoryPicker(false)}
                style={styles.categoryPickerClose}
              >
                <AppText style={styles.closeIcon}>✕</AppText>
              </Pressable>
            </View>

            {/* Category List */}
            <ScrollView contentContainerStyle={styles.categoryPickerList}>
              {/* "All Categories" option */}
              <Pressable
                style={[
                  styles.categoryPickerItem,
                  {
                    backgroundColor: !selectedCategoryId
                      ? isDark
                        ? '#2D3748'
                        : '#E0E7FF'
                      : colors.surface,
                    borderColor: !selectedCategoryId
                      ? '#6366F1'
                      : colors.border,
                  },
                ]}
                onPress={() => {
                  setValue('category_id', undefined);
                  setSelectedCategoryId(undefined);
                  setShowCategoryPicker(false);
                }}
              >
                <AppText
                  weight={!selectedCategoryId ? 'bold' : 'semibold'}
                  style={[
                    styles.categoryPickerItemText,
                    {color: colors.text},
                  ]}
                >
                  সকল বিভাগ
                </AppText>
                <AppText style={{fontSize: 18}}>🌍</AppText>
              </Pressable>

              {/* Category options */}
              {categories?.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryPickerItem,
                    {
                      backgroundColor:
                        selectedCategoryId === category.id
                          ? isDark
                            ? '#2D3748'
                            : '#E0E7FF'
                          : colors.surface,
                      borderColor:
                        selectedCategoryId === category.id
                          ? '#6366F1'
                          : colors.border,
                    },
                  ]}
                  onPress={() => {
                    setValue('category_id', category.id);
                    setSelectedCategoryId(category.id);
                    setShowCategoryPicker(false);
                  }}
                >
                  <View style={styles.categoryPickerItemContent}>
                    <View>
                      <AppText
                        weight={selectedCategoryId === category.id ? 'bold' : 'semibold'}
                        style={[
                          styles.categoryPickerItemText,
                          {color: colors.text},
                        ]}
                      >
                        {category.name}
                      </AppText>
                      <AppText
                        style={[
                          styles.categoryPickerItemType,
                          {color: colors.textMuted},
                        ]}
                      >
                        {category.type === 'income' ? 'আয়' : 'খরচ'}
                      </AppText>
                    </View>
                    {selectedCategoryId === category.id && (
                      <AppText style={{fontSize: 20}}>✓</AppText>
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  form: {
    gap: 24,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
  },
  categorySelect: {
    gap: 8,
  },
  categoryPickerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  categoryPickerContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  categoryPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  categoryPickerTitle: {
    fontSize: 16,
  },
  categoryPickerClose: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPickerList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  categoryPickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  categoryPickerItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  categoryPickerItemText: {
    fontSize: 14,
  },
  categoryPickerItemType: {
    fontSize: 12,
    marginTop: 2,
  },
});
