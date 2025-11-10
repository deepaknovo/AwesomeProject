export type Transaction = {
  id: string;
  amount: number;
  type: 'debit' | 'credit';
  date: string; // ISO string
  bank?: string | null;
  description?: string;
  category?: string;
  source: 'sms' | 'manual';
};
