import {CategoryKey, TransactionType} from '@/types';

export const categoryLabels: Record<CategoryKey, string> = {
  salary: 'বেতন',
  business: 'ব্যবসা',
  market: 'বাজার',
  transport: 'যাতায়াত',
  food: 'খাবার',
  rent: 'বাসা ভাড়া',
  utilities: 'বিল',
  health: 'স্বাস্থ্য',
  education: 'শিক্ষা',
  shopping: 'কেনাকাটা',
  savings: 'সঞ্চয়',
  other: 'অন্যান্য',
};

export const categoryTypeHints: Record<CategoryKey, TransactionType | 'both'> = {
  salary: 'income',
  business: 'income',
  market: 'expense',
  transport: 'expense',
  food: 'expense',
  rent: 'expense',
  utilities: 'expense',
  health: 'expense',
  education: 'expense',
  shopping: 'expense',
  savings: 'both',
  other: 'both',
};

export const categoryKeywords: Record<CategoryKey, string[]> = {
  salary: ['বেতন', 'সেলারি', 'মাইনে'],
  business: ['ব্যবসা', 'বিক্রি', 'লাভ', 'আয়'],
  market: ['বাজার', 'সবজি', 'মাছ', 'মাংস', 'মুদি'],
  transport: ['রিকশা', 'বাস', 'ভাড়া', 'উবার', 'পাঠাও', 'যাতায়াত', 'সিএনজি'],
  food: ['খাবার', 'রেস্টুরেন্ট', 'চা', 'নাস্তা', 'লাঞ্চ', 'ডিনার'],
  rent: ['বাসা ভাড়া', 'ভাড়া বাসা', 'রেন্ট'],
  utilities: ['বিদ্যুৎ', 'গ্যাস', 'পানি', 'ইন্টারনেট', 'বিল'],
  health: ['ডাক্তার', 'ঔষধ', 'হাসপাতাল', 'স্বাস্থ্য'],
  education: ['স্কুল', 'কলেজ', 'কোচিং', 'বই', 'শিক্ষা'],
  shopping: ['শপিং', 'জামা', 'কাপড়', 'কেনাকাটা'],
  savings: ['সঞ্চয়', 'সেভিংস', 'জমা'],
  other: [],
};
