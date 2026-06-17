import {categoryKeywords} from '@/constants/categories';
import {CategoryKey, TransactionType, VoiceTransactionDraft} from '@/types';
import {VoiceCategoryDraft} from '@/components/category/VoiceCategoryModal';
import {extractAmount} from '@/utils/banglaNumber';

const incomeWords = ['পেয়েছি', 'পেলাম', 'আয়', 'ইনকাম', 'বেতন', 'জমা হয়েছে', 'রিসিভ'];
const expenseWords = ['খরচ', 'দিয়েছি', 'দিলাম', 'ভাড়া', 'কিনেছি', 'পেমেন্ট', 'ব্যয়'];

function detectType(transcript: string, category: CategoryKey): TransactionType {
  if (incomeWords.some(word => transcript.includes(word))) {
    return 'income';
  }

  if (expenseWords.some(word => transcript.includes(word))) {
    return 'expense';
  }

  if (category === 'salary' || category === 'business') {
    return 'income';
  }

  return 'expense';
}

function detectCategory(transcript: string): CategoryKey {
  const match = Object.entries(categoryKeywords).find(([, keywords]) =>
    keywords.some(keyword => transcript.includes(keyword)),
  );

  return (match?.[0] as CategoryKey | undefined) ?? 'other';
}

export function parseBanglaVoiceCommand(transcript: string): VoiceTransactionDraft | null {
  const cleaned = transcript.trim();
  const amount = extractAmount(cleaned);

  if (!cleaned || !amount) {
    return null;
  }

  const category = detectCategory(cleaned);
  const type = detectType(cleaned, category);
  const confidence = category === 'other' ? 0.72 : 0.9;

  return {
    transcript: cleaned,
    amount,
    type,
    category,
    note: cleaned,
    confidence,
  };
}

export function parseCategoryVoiceCommand(transcript: string): VoiceCategoryDraft | null {
  const cleaned = transcript.trim();
  const lower = cleaned.toLowerCase();
  
  const isCategoryCommand = 
    lower.includes('create category') || 
    lower.includes('ক্যাটাগরি তৈরি') || 
    lower.includes('ক্যাটাগরি যোগ');

  if (!isCategoryCommand) {
    return null;
  }

  const type: TransactionType = 
    lower.includes('income') || lower.includes('আয়') || lower.includes('ইনকাম') ? 'income' : 'expense';

  let name = cleaned
    .replace(/create\s+category/i, '')
    .replace(/ক্যাটাগরি\s+তৈরি\s+করুন/i, '')
    .replace(/ক্যাটাগরি\s+তৈরি/i, '')
    .replace(/ক্যাটাগরি\s+যোগ\s+করুন/i, '')
    .replace(/ক্যাটাগরি\s+যোগ/i, '')
    .replace(/income/i, '')
    .replace(/expense/i, '')
    .replace(/আয়/i, '')
    .replace(/খরচ/i, '')
    .trim();
  
  if (!name) name = 'নতুন ক্যাটাগরি';

  return {
    transcript: cleaned,
    name,
    type,
  };
}
