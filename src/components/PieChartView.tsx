// src/components/PieChartView.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useStore } from '../store/useStore';

const screenWidth = Dimensions.get('window').width;

export default function PieChartView() {
  const { transactions } = useStore();

  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === 'credit') acc.income += t.amount;
      else if (t.type === 'debit') acc.expense += t.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const data = [
    {
      name: 'Income',
      amount: totals.income,
      color: '#4CAF50',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Expense',
      amount: totals.expense,
      color: '#E53935',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  if (transactions.length === 0) {
    return (
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text>No transactions to display.</Text>
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
        Income vs Expense
      </Text>
      <PieChart
        data={data.map((d) => ({
          name: d.name,
          population: d.amount,
          color: d.color,
          legendFontColor: d.legendFontColor,
          legendFontSize: d.legendFontSize,
        }))}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: () => '#000',
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="10"
        absolute
      />
    </View>
  );
}
