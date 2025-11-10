import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useStore } from '../store/useStore';
import { Transaction } from '../types';
import uuid from 'react-native-uuid';
import { Picker } from '@react-native-picker/picker';
import { insertTransaction } from '../services/db';

const AddSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),
  date: Yup.string().required('Date is required'),
  category: Yup.string().required('Category is required'),
});

export default function AddExpenseScreen({ navigation }: any) {
  const addTransaction = useStore((s) => s.addTransaction);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Card style={styles.card}>
        <Card.Title title="Add New Expense" titleStyle={styles.title} />
        <Card.Content>
          <Formik
            initialValues={{
              amount: '',
              date: new Date().toISOString().substring(0, 10),
              category: 'Other',
              notes: '',
            }}
            validationSchema={AddSchema}
            onSubmit={(vals) => {
              const tx: Transaction = {
                id: String(uuid.v4()),
                amount: Number(vals.amount),
                type: 'debit',
                date: new Date(vals.date).toISOString(),
                description: vals.notes,
                category: vals.category,
                source: 'manual',
              };
              insertTransaction(tx);
              addTransaction(tx);
              navigation.goBack();
            }}
          >
            {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
              <>
                {/* Amount */}
                <TextInput
                  label="Amount"
                  mode="outlined"
                  keyboardType="numeric"
                  value={values.amount}
                  onChangeText={handleChange('amount')}
                  style={styles.input}
                  left={<TextInput.Icon icon="currency-inr" />}
                />
                <HelperText type="error" visible={touched.amount && !!errors.amount}>
                  {errors.amount}
                </HelperText>

                {/* Date */}
                <TextInput
                  label="Date"
                  mode="outlined"
                  value={values.date}
                  onChangeText={handleChange('date')}
                  style={styles.input}
                  left={<TextInput.Icon icon="calendar" />}
                />
                <HelperText type="error" visible={touched.date && !!errors.date}>
                  {errors.date}
                </HelperText>

                {/* Category */}
                <Text style={styles.pickerLabel}>Category</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={values.category}
                    onValueChange={(itemValue) => setFieldValue('category', itemValue)}
                    dropdownIconColor="#3E7BFA"
                    style={styles.picker}
                  >
                    <Picker.Item label="Select a category..." value="" />
                    <Picker.Item label="Food" value="Food" />
                    <Picker.Item label="Transport" value="Transport" />
                    <Picker.Item label="Shopping" value="Shopping" />
                    <Picker.Item label="Health" value="Health" />
                    <Picker.Item label="Entertainment" value="Entertainment" />
                    <Picker.Item label="Bills" value="Bills" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
                <HelperText type="error" visible={touched.category && !!errors.category}>
                  {errors.category}
                </HelperText>

                {/* Notes */}
                <TextInput
                  label="Notes"
                  mode="outlined"
                  value={values.notes}
                  onChangeText={handleChange('notes')}
                  style={styles.input}
                  multiline
                  left={<TextInput.Icon icon="note-text-outline" />}
                />

                {/* Submit Button */}
                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  style={styles.button}
                  icon="plus-circle-outline"
                >
                  Add Expense
                </Button>
              </>
            )}
          </Formik>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    padding: 16,
  },
  card: {
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  input: {
    marginVertical: 6,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  pickerLabel: {
    marginTop: 10,
    marginBottom: 4,
    color: '#555',
    fontSize: 14,
  },
  picker: {
    height: 50,
    color: '#1C1C1E',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 6,
    backgroundColor: '#3E7BFA',
  },
});
