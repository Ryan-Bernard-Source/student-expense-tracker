import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

export default function ExpenseScreen() {
  const db = useSQLiteContext();

  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'week' | 'month'
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const filterExpenses = () => {
    const now = new Date();
    let filtered = [...expenses];

    if (filter === 'week') {
    const startOfWeek = new Date(now); 
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek); 
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    filtered = filtered.filter(e => {
      const d = new Date(e.date);
      return d >= startOfWeek && d <= endOfWeek;
      });
    }   else if (filter === 'month') {
      filtered = filtered.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    }

    setFilteredExpenses(filtered);
  };
useEffect(() => { filterExpenses(); }, [expenses, filter]);

  const loadExpenses = async () => {
    const rows = await db.getAllAsync(
      'SELECT * FROM expenses ORDER BY date DESC, id DESC;'
    );
    setExpenses(rows);
  };
  const addExpense = async () => {
    const amountNumber = parseFloat(amount);

    if (isNaN(amountNumber) || amountNumber <= 0) {
      // Basic validation: ignore invalid or non-positive amounts
      return;
    }

    const trimmedCategory = category.trim();
    const trimmedNote = note.trim();

    if (!trimmedCategory) {
      // Category is required
      return;
    }
    const today = new Date().toISOString().split('T')[0];
  await db.runAsync(
    'INSERT INTO expenses (amount, category, note, date) VALUES (?, ?, ?, ?);',
    [amountNumber, trimmedCategory, trimmedNote || null, today]
  ); // Update to add date to added expenses

    setAmount('');
    setCategory('');
    setNote('');

    loadExpenses();
  };

  const deleteExpense = async (id) => {
    await db.runAsync('DELETE FROM expenses WHERE id = ?;', [id]);
    loadExpenses();
  };
  // Expense Render
  const renderExpense = ({ item }) => (
    <View style={styles.expenseRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.expenseAmount}>${Number(item.amount).toFixed(2)}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        {item.note ? <Text style={styles.expenseNote}>{item.note}</Text> : null}
        {/* Add date display */}
        <Text style={styles.expenseNote}>{item.date}</Text>
      </View>

      <TouchableOpacity onPress={() => deleteExpense(item.id)}>
        <Text style={styles.delete}>✕</Text>
      </TouchableOpacity>
    </View>
  );


  useEffect(() => {
    async function setup() {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          note TEXT,
          date TEXT NOT NULL
        );
      `);

      await loadExpenses();
    }

    setup();
  }, []);
// Display Total Spending
  const totalSpending = filteredExpenses.reduce((acc, e) => acc + Number(e.amount), 0);
   const categoryTotals = filteredExpenses.reduce((acc, e) => {
  if (!acc[e.category]) acc[e.category] = 0;
   acc[e.category] += Number(e.amount);
   return acc;
  }, {});
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Student Expense Tracker</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Amount (e.g. 12.50)"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Category (Food, Books, Rent...)"
          placeholderTextColor="#9ca3af"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Note (optional)"
          placeholderTextColor="#9ca3af"
          value={note}
          onChangeText={setNote}
        />
        <Button title="Add Expense" onPress={addExpense} />
      </View>

    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 }}>
        {['all', 'week', 'month'].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: filter === f ? '#24bafb' : '#374151',
            }}
          >
            <Text style={{
              color: filter === f ? '#111827' : '#fff',
              fontWeight: '700',
              textTransform: 'capitalize',
            }}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={{ color: '#c2bfb6ff', fontWeight: '700', fontSize: 16 }}>
        Total Spending: ${totalSpending.toFixed(2)}
      </Text>
      {Object.entries(categoryTotals).map(([cat, amt]) => (
        <Text key={cat} style={{ color: '#e5e7eb', fontSize: 14 }}>
          {cat}: ${amt.toFixed(2)}
        </Text>
      ))}
    </View>

      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExpense}
        ListEmptyComponent={
          <Text style={styles.empty}>No expenses yet.</Text>
        }
      />

      <Text style={styles.footer}>
        Enter your expenses and they’ll be saved locally with SQLite.
      </Text>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#111827' },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  form: {
    marginBottom: 16,
    gap: 8,
  },
  input: {
    padding: 10,
    backgroundColor: '#1f2937',
    color: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f0eee7ff',
  },
  expenseCategory: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  expenseNote: {
    fontSize: 12,
    color: '#9ca3af',
  },
  delete: {
    color: '#f87171',
    fontSize: 20,
    marginLeft: 12,
  },
  empty: {
    color: '#9ca3af',
    marginTop: 24,
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 12,
    fontSize: 12,
  },
  expenseDate: { fontSize: 12, color: '#9ca3af' 
  }
});