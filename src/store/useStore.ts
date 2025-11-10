import { create } from 'zustand';
import { Transaction } from '../types';
import uuid from 'react-native-uuid';

type State = {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setTransactions: (list: Transaction[]) => void;
};

export const useStore = create<State>((set: (arg0: { (s: { transactions: any; }): { transactions: any[]; }; (s: { transactions: any[]; }): { transactions: any[]; }; (s: { transactions: any[]; }): { transactions: any[]; }; transactions?: any; }) => any) => ({
  transactions: [],
  setTransactions: (list: any) => set(() => ({ transactions: list })),
  addTransaction: (t: any) =>
    set((s: { transactions: any; }) => ({ transactions: [{ id: String(uuid.v4()), ...t }, ...s.transactions] })),
  updateTransaction: (id: any, patch: any) =>
    set((s: { transactions: any[]; }) => ({ transactions: s.transactions.map((tr) => (tr.id === id ? { ...tr, ...patch } : tr)) })),
  deleteTransaction: (id: any) =>
    set((s: { transactions: any[]; }) => ({ transactions: s.transactions.filter((tr) => tr.id !== id) })),
}));
