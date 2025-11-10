import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { VictoryPie } from 'victory-native';
import TransactionCard from '../components/TransactionCard';

export default function DashboardScreen({ navigation }: any) {
  const transactions = useStore((s) => s.transactions);

  const balance = useMemo(() => {
    return transactions.reduce(
      (acc, t) => (t.type === 'credit' ? acc + t.amount : acc - t.amount),
      0
    );
  }, [transactions]);

  const monthlyExpenses = useMemo(() => {
    const currentMonth = new Date().getMonth();
    return transactions
      .filter(
        (t) => new Date(t.date).getMonth() === currentMonth && t.type === 'debit'
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const categories = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach((t) => {
        console.log('Transaction Category:', t.category);
      const cat = t.category || 'Uncategorized';
      if (t.type === 'debit') {
        map[cat] = (map[cat] || 0) + t.amount;
      }
    });
    return Object.entries(map).map(([x, y]) => ({ x, y }));
  }, [transactions]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* HEADER */}
      <Text style={styles.header}>Dashboard</Text>

      {/* SUMMARY CARDS */}
      <View style={styles.summaryRow}>
        <View style={[styles.card, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.cardTitle}>Total Balance</Text>
          <Text style={styles.cardValue}>₹ {balance.toFixed(2)}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#E53935' }]}>
          <Text style={styles.cardTitle}>Monthly Expenses</Text>
          <Text style={styles.cardValue}>₹ {monthlyExpenses.toFixed(2)}</Text>
        </View>
      </View>

      {/* ADD EXPENSE BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddExpense')}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Add Expense / Income</Text>
      </TouchableOpacity>

      {/* PIE CHART */}
      <Text style={styles.sectionTitle}>Category-wise Spending</Text>
      {categories.length > 0 ? (
        <View style={{
          alignItems: 'center'
        ,flexDirection:"row",
        justifyContent:"space-around",
        width:"100%",
       
        }}>
            <View style={{  alignItems: 'center', width:"50%"}}>
    <VictoryPie
    data={categories}
    colorScale={['#F44336', '#FF9800', '#4CAF50', '#2196F3', '#9C27B0']}
    innerRadius={50}
    labelRadius={50}
    style={{
      labels: { fill: 'white', fontSize: 10 }
    }}
    
    labels={() => null} // 👈 hide on-chart labels
    animate={{ duration: 1000 }}
    height={250}
  />
  </View>

  <View style={{ }}>
    {categories.map((cat, i) => (
      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: ['#F44336', '#FF9800', '#4CAF50', '#2196F3', '#9C27B0'][i % 5],
            marginRight: 8,
          }}
        />
        <Text style={{ color: '#333', fontSize: 14 }}>{cat.x}: ₹{cat.y}</Text>
      </View>
    ))}
  </View>
</View>

      ) : (
        <Text style={{ textAlign: 'center', color: '#999' }}>
          No category data available
        </Text>
      )}

      {/* LAST 5 TRANSACTIONS */}
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}  >
      <Text style={styles.sectionTitle}>Last 5 Transactions</Text>
      <TouchableOpacity 
  onPress={() => navigation.navigate('History')}
  style={{
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-end',
  }}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>View All</Text>
</TouchableOpacity>
</View>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions.slice(0, 5)}
          renderItem={({ item }:any) => <TransactionCard t={item} />}
          keyExtractor={(i) => i.id}
          scrollEnabled={false}
        />
      ) : (
        <Text style={{ textAlign: 'center', color: '#999', marginTop: 10 }}>
          No transactions yet
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 5,
    elevation: 3,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  cardValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#2563EB',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 24,
    marginBottom: 8,
  },
});
