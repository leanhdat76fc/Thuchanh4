
import React, {useState, useEffect} from 'react';
import {View,Text,SafeAreaView,TextInput,StyleSheet, Image,Platform,TouchableOpacity,} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import COLORS from '../assets/theme/Color';
import {createNewService} from '../context';

const AddService = () => {
  const [service, setService] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const ref = firestore().collection('services');
  const [services, setServices] = useState([]);

  async function addService() {
    if (service.trim() === '') {
      setServiceError('Chưa nhập dịch vụ');
      return;
    } else {
      setServiceError('');
    }

    if (isNaN(parseFloat(price))) {
      setPriceError('Chưa nhập giá tiền.');
      return;
    } else {
      setPriceError('');
    }

    let imageUrl = '';
    if (imageUri) {
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const uploadUri =
        Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
      const task = storage().ref(filename).putFile(uploadUri);

      try {
        await task;
        imageUrl = await storage().ref(filename).getDownloadURL();
      } catch (e) {
        console.error(e);
      }
    }

    const newService = {
      title: service,
      price: parseFloat(price),
      imageUrl,
    };

    createNewService(newService);

    setService('');
    setPrice('');
    setImageUri(null);
  }

  const selectImage = () => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  useEffect(() => {
    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {title, price, imageUrl} = doc.data();
        list.push({
          id: doc.id,
          title,
          price,
          imageUrl,
        });
      });
      setServices(list);

      if (loading) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          placeholder="Service Name ..."
          placeholderTextColor="#9BA4B5"
          value={service}
          onChangeText={text => setService(text)}
          style={styles.textInput}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Price..."
          placeholderTextColor="#9BA4B5"
          value={price.toString()}
          keyboardType="numeric"
          onChangeText={text => {
            if (/^\d*\.?\d*$/.test(text) || text === '') {
              setPrice(text);
              setPriceError('');
            } else {
              setPriceError('Chỉ được phép nhập số!!.');
            }
          }}
        />
      </View>
      <Text style={styles.errorText}>
        {serviceError}
        {serviceError && priceError ? ' & ' : ''}
        {priceError}
      </Text>
      {imageUri ? (
        <Image source={{uri: imageUri}} style={styles.imagePreview} />
      ) : null}
      <TouchableOpacity style={styles.loginBtn} onPress={selectImage}>
        <Icon name="camera" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={addService}>
        <Icon name="plus" size={20} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#fb5b5a',
    marginBottom: 40,
  },
  inputView: {
    borderRadius: 5,
    backgroundColor: '#fff',
    margin: 10,
    padding: 2,
    width: '95%',
    elevation: 5,
    borderWidth: 5,
    borderColor: '#ffffff',
  },
  inputText: {
    height: 50,
    color: '#003f5c',
  },
  imagePreview: {
    width: 250,
    height: 250,
    marginTop: 10,
  },
  loginBtn: {
    width: '90%',
    backgroundColor: COLORS.pink,
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 20,
  },
  questions: {
    color: '#003f5c',
  },
  errorText: {
    color: 'red',
  },
});

export default AddService;
