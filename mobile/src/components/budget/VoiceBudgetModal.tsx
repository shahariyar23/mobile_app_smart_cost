import React, {useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {budgetsApi} from '@/api/budgets';
import {AppText} from '@/components/AppText';
import {AppButton} from '@/components/AppButton';
import {formatTaka} from '@/utils/currency';

interface VoiceBudgetModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (values: any) => void;
}

interface RecognizedBudget {
  month: string;
  amount: number;
  category?: string;
}

export function VoiceBudgetModal({
  visible,
  onClose,
  onSuccess,
}: VoiceBudgetModalProps) {
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const isDark = colorScheme === 'dark';
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [budget, setBudget] = useState<RecognizedBudget | null>(null);

  const colors = isDark
    ? {
        bg: '#0F1419',
        surface: '#1A1F2E',
        border: '#2D3748',
        text: '#FFFFFF',
        textMuted: '#A0AEC0',
        accent: '#667eea',
      }
    : {
        bg: '#FFFFFF',
        surface: '#F9FAFB',
        border: '#E5E7EB',
        text: '#111827',
        textMuted: '#6B7280',
        accent: '#667eea',
      };

  const mutation = useMutation({
    mutationFn: budgetsApi.upsert,
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['budget', 'current']});
      onSuccess(data);
    },
  });

  const handleStartListening = async () => {
    setIsListening(true);
    setRecognizedText('');
    setBudget(null);

    // Simulate voice recognition
    // In production, use a speech-to-text library like react-native-voice
    setTimeout(() => {
      const sampleTexts = [
        'খাবারের বাজেট আটহাজার টাকা সেট করো',
        'মাসিক বাজেট ত্রিশ হাজার টাকা',
        'পরিবহনের জন্য পাঁচ হাজার টাকা বাজেট',
      ];
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      setRecognizedText(randomText);
      setIsListening(false);

      // Parse the recognized text to extract budget
      const parsedBudget = parseVoiceInput(randomText);
      setBudget(parsedBudget);
    }, 3000);
  };

  const parseVoiceInput = (text: string): RecognizedBudget => {
    // Simple parser - in production, use NLP
    const numberMatch = text.match(/(\d+)\s*(হাজার|টাকা)?/);
    const amount = numberMatch ? parseInt(numberMatch[1]) * 1000 : 30000;

    return {
      month: new Date().toISOString().slice(0, 7),
      amount,
    };
  };

  const handleConfirm = () => {
    if (budget) {
      mutation.mutate(
        {
          month: budget.month,
          amount: budget.amount,
          alertThreshold: 80,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

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
            ভয়েস বাজেট
          </AppText>
          <View style={{width: 40}} />
        </View>

        {/* Content */}
        <View style={[styles.content, {backgroundColor: colors.bg}]}>
          {!isListening && !recognizedText ? (
            <>
              {/* Initial State */}
              <View style={styles.illustration}>
                <AppText style={styles.illustrationIcon}>🎤</AppText>
              </View>

              <View style={styles.textContent}>
                <AppText
                  weight="bold"
                  style={[styles.title, {color: colors.text}]}
                >
                  ভয়েসে বাজেট বলুন
                </AppText>
                <AppText
                  style={[styles.description, {color: colors.textMuted}]}
                >
                  উদাহরণ: "খাবারের বাজেট আটহাজার টাকা" বা "মাসিক বাজেট ত্রিশ হাজার"
                </AppText>
              </View>

              <AppButton
                title="শোনা শুরু করুন"
                onPress={handleStartListening}
                style={styles.button}
              />
            </>
          ) : isListening ? (
            <>
              {/* Listening State */}
              <View style={styles.listeningContainer}>
                <View
                  style={[
                    styles.micPulse,
                    {backgroundColor: colors.accent},
                  ]}
                />
                <AppText
                  weight="bold"
                  style={[styles.listeningText, {color: colors.text}]}
                >
                  শোনা হচ্ছে...
                </AppText>
              </View>
            </>
          ) : (
            <>
              {/* Result State */}
              <View style={styles.resultContainer}>
                <AppText
                  weight="bold"
                  style={[styles.resultTitle, {color: colors.text}]}
                >
                  আপনি বলেছেন:
                </AppText>
                <View
                  style={[
                    styles.recognizedBox,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <AppText style={[styles.recognizedText, {color: colors.text}]}>
                    "{recognizedText}"
                  </AppText>
                </View>

                {budget && (
                  <>
                    <AppText
                      weight="bold"
                      style={[styles.detectedTitle, {color: colors.text}]}
                    >
                      সনাক্ত করা হয়েছে:
                    </AppText>
                    <View
                      style={[
                        styles.budgetBox,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.accent,
                        },
                      ]}
                    >
                      <View style={styles.budgetItem}>
                        <AppText
                          style={[styles.budgetLabel, {color: colors.textMuted}]}
                        >
                          বাজেট পরিমাণ:
                        </AppText>
                        <AppText
                          weight="bold"
                          style={[styles.budgetValue, {color: colors.accent}]}
                        >
                          {formatTaka(budget.amount)}
                        </AppText>
                      </View>
                      <View style={styles.budgetItem}>
                        <AppText
                          style={[styles.budgetLabel, {color: colors.textMuted}]}
                        >
                          মাস:
                        </AppText>
                        <AppText
                          weight="bold"
                          style={[styles.budgetValue, {color: colors.text}]}
                        >
                          {budget.month}
                        </AppText>
                      </View>
                    </View>
                  </>
                )}
              </View>
            </>
          )}
        </View>

        {/* Footer */}
        {recognizedText && (
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
              title="আবার চেষ্টা করুন"
              variant="secondary"
              onPress={() => {
                setRecognizedText('');
                setBudget(null);
                handleStartListening();
              }}
              style={styles.footerButton}
            />
            <AppButton
              title={mutation.isPending ? '' : 'নিশ্চিত করুন'}
              onPress={handleConfirm}
              loading={mutation.isPending}
              style={styles.footerButton}
            />
          </View>
        )}
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
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
  textContent: {
    alignItems: 'center',
    gap: 12,
    maxWidth: 280,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    minWidth: 200,
  },
  listeningContainer: {
    alignItems: 'center',
    gap: 16,
  },
  micPulse: {
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.7,
  },
  listeningText: {
    fontSize: 16,
  },
  resultContainer: {
    width: '100%',
    gap: 16,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  recognizedBox: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  recognizedText: {
    fontSize: 13,
    fontWeight: '500',
  },
  detectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  budgetBox: {
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  budgetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  budgetValue: {
    fontSize: 14,
    fontWeight: '700',
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
});
