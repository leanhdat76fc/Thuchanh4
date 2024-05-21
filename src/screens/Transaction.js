import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('history')
      .onSnapshot(querySnapshot => {
        const transactions = [];
        querySnapshot.forEach(documentSnapshot => {
          transactions.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setTransactions(transactions);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Customer: {item.userName}</Text>
      <Text style={styles.itemText}>Service name: {item.serviceName}</Text>
      <Text style={styles.itemText}>Price: {item.servicePrice}</Text>
      <Text style={styles.itemText}>
        Date: {new Date(item.paymentDate.toDate()).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={item => item.key}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
  },
});

export default Transaction;