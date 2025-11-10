import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Transaction } from '../types';

SQLite.enablePromise(true);

const DB_NAME = 'smart_expense_tracker.db';
let dbInstance: SQLiteDatabase | null = null;

export async function getDB() {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
  await dbInstance.executeSql(
    `CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY NOT NULL,
      amount REAL,
      type TEXT,
      date TEXT,
      bank TEXT,
      description TEXT,
      category TEXT,
      source TEXT
    )`,
  );
  return dbInstance;
}

export async function insertTransaction(tx: Transaction) {
  const db = await getDB();
  return db.executeSql(
    `INSERT OR REPLACE INTO transactions (id, amount, type, date, bank, description, category, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [tx.id, tx.amount, tx.type, tx.date, tx.bank || null, tx.description || null, tx.category || null, tx.source],
  );
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const db = await getDB();
  const [res] = await db.executeSql(`SELECT * FROM transactions ORDER BY date DESC`);
  const rows = res.rows;
  const list: Transaction[] = [];
  for (let i = 0; i < rows.length; i++) {
    list.push(rows.item(i));
  }
  return list;
}

export async function deleteTransactionDb(id: string) {
  const db = await getDB();
  return db.executeSql(`DELETE FROM transactions WHERE id = ?`, [id]);
}
