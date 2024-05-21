import React, {useState, useEffect} from 'react';
import {View,Image,TextInput, StyleSheet,TouchableOpacity,Text, Alert,} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import COLORS from '../assets/theme/Color';

const UpdateService = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    id,
    title: initialTitle,
    price: initialPrice,
    imageUrl: initialImageUrl,
  } = route.params;

  const [title, setTitle] = useState(initialTitle);
  const [price, setPrice] = useState(initialPrice.toString());
  const [imageUri, setImageUri] = useState(initialImageUrl);
  const [finalUpdate, setFinalUpdate] = useState(null);

  const ref = firestore().collection('services').doc(id);

  useEffect(() => {
    const unsubscribe = ref.onSnapshot(doc => {
      const data = doc.data();
      if (data && data.finalUpdate) {
        setFinalUpdate(data.finalUpdate);
      }
    });

    return () => unsubscribe();
  }, []);

  const selectImage = () => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleUpdate = async () => {
    let newImageUrl = imageUri;

    if (imageUri !== initialImageUrl) {
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const uploadUri =
        Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
      const task = storage().ref(filename).putFile(uploadUri);

      try {
        await task;
        newImageUrl = await storage().ref(filename).getDownloadURL();
      } catch (e) {
        console.error(e);
      }
    }

    await ref.update({
      title,
      price: parseFloat(price),
      imageUrl: newImageUrl,
      finalUpdate: firestore.FieldValue.serverTimestamp(),
    });

    Alert.alert('Success', 'Service updated successfully!');

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Service Name"
          style={styles.textInput}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="Price"
          keyboardType="numeric"
          style={styles.textInput}
        />
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        {imageUri ? (
          <Image source={{uri: imageUri}} style={styles.image} />
        ) : null}
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={selectImage}>
        <Icon name="camera" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={handleUpdate}>
        <Text style={styles.loginText}>Update Service</Text>
      </TouchableOpacity>
      {finalUpdate && (
        <View style={styles.finalUpdate}>
          <Text style={styles.finalUpdateText}>Last Updated:</Text>
          <Text style={styles.finalUpdateText}>
            {new Date(finalUpdate.seconds * 1000).toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  loginBtn: {
    width: '90%',
    backgroundColor: COLORS.pink,
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  loginText: {
    color: '#fff',
    fontSize: 20,
  },
  image: {
    width: 380,
    height: 300,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.blue,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 15,
    width: 180,
    height: 40,
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
    fontSize: 30,
  },
  finalUpdate: {
    flexDirection: 'row',
  },
  finalUpdateText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UpdateService;