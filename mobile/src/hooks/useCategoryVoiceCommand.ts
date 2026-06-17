import {useEffect, useState} from 'react';
import Voice, {SpeechResultsEvent} from '@react-native-voice/voice';
import {parseCategoryVoiceCommand} from '@/utils/voiceParser';
import {VoiceCategoryDraft} from '@/components/category/VoiceCategoryModal';

export function useCategoryVoiceCommand() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<VoiceCategoryDraft | null>(null);

  useEffect(() => {
    const onSpeechResults = (event: SpeechResultsEvent) => {
      const transcript = event.value?.[0];
      if (!transcript) {
        return;
      }

      const parsed = parseCategoryVoiceCommand(transcript);
      if (parsed) {
        setDraft(parsed);
      } else {
        setError('দুঃখিত, ক্যাটাগরি নাম বুঝতে পারিনি। "ক্যাটাগরি কফি তৈরি করুন" এর মতো কিছু বলুন।');
      }
      setIsListening(false);
    };

    const onSpeechError = () => {
      setError('ভয়েস কমান্ড নেওয়া যায়নি। আবার চেষ্টা করুন।');
      setIsListening(false);
    };

    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      // Need to clean up when component unmounts, but since Voice is a singleton,
      // it might conflict with the global useVoiceCommand if both are active.
      // So we just remove these specific listeners.
      Voice.onSpeechResults = undefined as any;
      Voice.onSpeechError = undefined as any;
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
