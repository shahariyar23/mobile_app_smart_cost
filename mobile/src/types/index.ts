export type TransactionType = 'income' | 'expense';

export type CategoryKey =
  | 'salary'
  | 'business'
  | 'market'
  | 'transport'
  | 'food'
  | 'rent'
  | 'utilities'
  | 'health'
  | 'education'
  | 'shopping'
  | 'savings'
  | 'other';

export type User = {
  id: string;
  name: string;
  phone: string;
  email?: string;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: CategoryKey;
  note?: string;
  occurredAt: string;
};

export type Budget = {
  id: string;
  month: string;
  amount: number;
  spent: number;
  alertThreshold: number;
};

export type SavingsGoal = {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  targetDate?: string;
};

export type FinancialSummary = {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  savings: number;
};

export type ReportRange = 'weekly' | 'monthly' | 'yearly';

export type VoiceTransactionDraft = {
  transcript: string;
  amount: number;
  type: TransactionType;
  category: CategoryKey;
  note: string;
  confidence: number;
};
