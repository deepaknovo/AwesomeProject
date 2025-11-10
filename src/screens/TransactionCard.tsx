import React from 'react';
import { View, Text } from 'react-native';
import { Transaction } from '../types';

export default function TransactionCard({ t }: { t: Transaction }) {
  return (
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
      <Text style={{ fontWeight: '700' }}>{t.description?.slice(0, 80) || t.category}</Text>
      <Text>{new Date(t.date).toLocaleString()}</Text>
      <Text>{t.type === 'debit' ? '-' : '+'}{t.amount.toFixed(2)}</Text>
      <Text>{t.bank}</Text>
    </View>
  );
}
