import {useEffect, useState} from 'react';
import Voice, {SpeechResultsEvent} from '@react-native-voice/voice';
import {parseBanglaVoiceCommand} from '@/utils/voiceParser';
import {VoiceTransactionDraft} from '@/types';

export function useVoiceCommand() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<VoiceTransactionDraft | null>(null);

  useEffect(() => {
    Voice.onSpeechResults = (event: SpeechResultsEvent) => {
      const transcript = event.value?.[0];
      if (!transcript) {
        return;
      }

      const parsed = parseBanglaVoiceCommand(transcript);
      if (parsed) {
        setDraft(parsed);
      } else {
        setError('দুঃখিত, টাকার পরিমাণ বুঝতে পারিনি। আবার বলুন।');
      }
      setIsListening(false);
    };

    Voice.onSpeechError = () => {
      setError('ভয়েস কমান্ড নেওয়া যায়নি। আবার চেষ্টা করুন।');
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const start = async () => {
    setError(null);
    setDraft(null);
    setIsListening(true);
    await Voice.start('bn-BD');
  };

  const stop = async () => {
    await Voice.stop();
    setIsListening(false);
  };

  const clearDraft = () => setDraft(null);

  return {isListening, error, draft, start, stop, clearDraft};
}
