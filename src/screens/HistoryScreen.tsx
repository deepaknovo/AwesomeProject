// src/screens/HistoryScreen.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';
import { deleteTransactionDb } from '../services/db';
import TransactionCard from '../components/TransactionCard';
import { RectButton } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function HistoryScreen() {
  const { transactions, deleteTransaction } = useStore();

  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBank, setSelectedBank] = useState<string>('All');

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTransactionDb(id);
          deleteTransaction(id);
        },
      },
    ]);
  };


  // Filter logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchMonth =
        selectedMonth === 'All' || new Date(t.date).getMonth() + 1 === parseInt(selectedMonth);
      const matchCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchBank = selectedBank === 'All' || t.bank === selectedBank;
      return matchMonth && matchCategory && matchBank;
    });
  }, [transactions, selectedMonth, selectedCategory, selectedBank]);

 
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>

      {/* 🔹 Filter Bar */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setSelectedMonth('All')}>
          <Text style={styles.filterText}>Month: {selectedMonth}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setSelectedCategory('All')}>
          <Text style={styles.filterText}>Category: {selectedCategory}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setSelectedBank('All')}>
          <Text style={styles.filterText}>Bank: {selectedBank}</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Transaction List */}
      <SwipeListView
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }:any) => (
          <View style={styles.rowFront}>
            <TransactionCard t={item} />
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.rowBack}>
           
            <TouchableOpacity
              style={[styles.backBtn, { backgroundColor: 'red' }]}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-160} // Width for 2 buttons
        disableRightSwipe
        ListEmptyComponent={<Text>No transactions found.</Text>}
      />
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  filterBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  filterText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  swipeActions: { flexDirection: 'row' },
  actionBtn: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 4,
  },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#666', marginTop: 10, fontSize: 16 },
   rowFront: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // elevation: 3,
  },
  rowBack: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // alignItems: 'center',
    margin: 6,
    height: '90%',
  },
  
  backBtn: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  btnText: { color: '#fff', fontWeight: '600' },
});
