// src/screens/HistoryScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { useStore } from '../store/useStore';
import { deleteTransactionDb } from '../services/db';
import TransactionCard from '../components/TransactionCard';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HistoryScreen() {
  const { transactions, deleteTransaction } = useStore();

  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBank, setSelectedBank] = useState('All');
  const [isFilterVisible, setFilterVisible] = useState(false);

  const months = [
    'All',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ['All', ...Array.from(set).filter((v): v is string => typeof v === 'string' && v.length > 0)];
  }, [transactions]);

  const banks = useMemo(() => {
    const set = new Set(transactions.map((t) => t.bank));
    return ['All', ...Array.from(set).filter((v): v is string => typeof v === 'string' && v.length > 0)];
  }, [transactions]);

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

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchMonth =
        selectedMonth === 'All' ||
        new Date(t.date).getMonth() + 1 === parseInt(selectedMonth);
      const matchCategory =
        selectedCategory === 'All' || t.category === selectedCategory;
      const matchBank = selectedBank === 'All' || t.bank === selectedBank;
      return matchMonth && matchCategory && matchBank;
    });
  }, [transactions, selectedMonth, selectedCategory, selectedBank]);

  const renderFilterOption = (label: string, current: string, setter: Function) => (
    <TouchableOpacity
      key={label}
      style={[
        styles.optionBtn,
        { backgroundColor: current === label ? '#2196F3' : '#eee' },
      ]}
      onPress={() => setter(label)}
    >
      <Text style={{ color: current === label ? '#fff' : '#333' }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Transaction History</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Icon name="filter" size={22} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <SwipeListView
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: any) => (
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
        rightOpenValue={-100}
        disableRightSwipe
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found.</Text>
          </View>
        }
      />

      {/* 🔹 Bottom Sheet Filter Modal */}
      <Modal
        visible={isFilterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filter Transactions</Text>
              <Pressable onPress={() => setFilterVisible(false)}>
                <Icon name="close" size={22} color="#444" />
              </Pressable>
            </View>

            <ScrollView>
              <Text style={styles.sectionTitle}>Month</Text>
              <View style={styles.optionsRow}>
                {months.map((m) => renderFilterOption(m, selectedMonth, setSelectedMonth))}
              </View>

              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.optionsRow}>
                {categories.map((c) => renderFilterOption(c, selectedCategory, setSelectedCategory))}
              </View>

              <Text style={styles.sectionTitle}>Bank</Text>
              <View style={styles.optionsRow}>
                {banks.map((b) => renderFilterOption(b, selectedBank, setSelectedBank))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  rowFront: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  rowBack: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 6,
    height: '80%',
  },
  backBtn: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  btnText: { color: '#fff', fontWeight: '600' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#666', marginTop: 10, fontSize: 16 },

  // 🔹 Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetTitle: { fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, marginTop: 16, fontWeight: '600' },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  optionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 4,
  },
  applyBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 20,
  },
  applyText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
