// src/components/TransactionCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

type Transaction = {
  id: string;
  amount: number;
  category: any;
  type: 'credit' | 'expense';
  date: string;
  bank?: string;
  description?: string;
};

interface Props {
  t: Transaction;
}

export default function TransactionCard({ t }: Props) {
  const iconName = t.type === 'credit' ? 'arrow-down-bold-circle' : 'arrow-up-bold-circle';
  const color = t.type === 'credit' ? '#4CAF50' : '#E53935';

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        {t.type == 'credit' ?
       <Image 
        resizeMode='contain'
        style={{width:30,height:40}}
        src={"https://media.istockphoto.com/id/1144366258/vector/green-arrow-pointing-up-direction-symbol-green-directional-arrow-sign-icon-flat-up-arrow.jpg?s=612x612&w=is&k=20&c=hPT4xmgkLynT_2Xgr5w_xE40eq6-HG7l53ljrssl-C0="} 
       />
       : 
       <Image 
        resizeMode='contain'
        style={{width:30,height:40}}
        src={"https://www.shutterstock.com/image-illustration/arrow-down-glyph-rounded-icon-260nw-505147855.jpg"} 
       />
        }
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.category}>{t.category || 'Other'}</Text>
        {t.bank && <Text style={styles.subText}>{t.bank}</Text>}
        {t.description && <Text style={styles.subText}>{t.description}</Text>}
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.amount, { color }]}>{t.type === 'credit' ? '+' : '-'}₹{t.amount}</Text>
        <Text style={styles.subText}>
          {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  subText: {
    fontSize: 12,
    color: '#777',
  },
});
