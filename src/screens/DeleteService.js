import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../assets/theme/Color';

const DetailService = () => {
  const route = useRoute();
  const { title, price, imageUrl, id } = route.params;
  const navigation = useNavigation();
  const ref = firestore().collection('services').doc(id);

  const [finalUpdate, setFinalUpdate] = useState(null);

  useEffect(() => {
    const unsubscribe = ref.onSnapshot(snapshot => {
      const data = snapshot.data();
      if (data) {
        setFinalUpdate(data.finalUpdate);
      }
    });

    return () => unsubscribe();
  }, [id]);

  const priceFormat = Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.title}>Service name:</Text>
        <Text style={styles.titlefortitle}>{title}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.title}>Price:</Text>
        <Text style={styles.price}>{priceFormat}</Text>
      </View>
      {finalUpdate && finalUpdate.seconds ? (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.title}>Last Updated:</Text>
          <Text style={styles.finalUpdate}>
            {new Date(finalUpdate.seconds * 1000).toLocaleString()}
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.title}>Last Updated:</Text>
          <Text style={styles.finalUpdate}>No update info</Text>
        </View>
      )}
      <View style={{ alignItems: 'center', padding: 20 }}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginLeft: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    padding: 5,
  },
  titlefortitle: {
    fontSize: 20,
    color: 'black',
    padding: 5,
  },
  price: {
    fontSize: 20,
    color: 'red',
    padding: 5,
    marginLeft: 5,
  },
  finalUpdate: {
    fontSize: 20,
    color: 'black',
    padding: 5,
    marginLeft: 5,
  },
  image: {
    width: 400,
    height: 400,
  },
});

export default DetailService;
