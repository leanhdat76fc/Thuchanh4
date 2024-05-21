import { Alert,View,TextInput,TouchableOpacity, StyleSheet,Text,} from 'react-native';
  import {useState} from 'react';
  import firestore from '@react-native-firebase/firestore';
  import auth from '@react-native-firebase/auth';
  import COLORS from '../assets/theme/Color';
  
  const Register = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
  
    const USERS = firestore().collection('USERS');
  
    const handleCreateAccount = () => {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          USERS.doc(email).set({
            name,
            email,
            password,
            address,
            phone,
            role: 'customer',
          });
          navigation.navigate('Login');
        })
        .catch(e => Alert.alert('Tài khoản tồn tại'));
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          {}
          <Text style={styles.logo}>SIGNUP</Text>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            value={name}
            placeholder="Fullname..."
            placeholderTextColor="#9BA4B5"
            onChangeText={setName}></TextInput>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            value={email}
            placeholder="Email..."
            placeholderTextColor="#9BA4B5"
            onChangeText={setEmail}></TextInput>
        </View>
        <View style={styles.inputView}>
          <TextInput
            secureTextEntry
            style={styles.inputText}
            value={password}
            placeholder="Password..."
            placeholderTextColor="#9BA4B5"
            onChangeText={setPassword}></TextInput>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            secureTextEntry
            value={passwordConfirm}
            placeholder="ComfirmPassword..."
            placeholderTextColor="#9BA4B5"
            onChangeText={setPasswordConfirm}></TextInput>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            value={address}
            placeholder="Address"
            placeholderTextColor="#9BA4B5"
            onChangeText={setAddress}></TextInput>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            value={phone}
            placeholder="Phone"
            placeholderTextColor="#9BA4B5"
            onChangeText={setPhone}></TextInput>
        </View>
        <TouchableOpacity onPress={handleCreateAccount} style={styles.loginBtn}>
          <Text style={styles.loginText}>SIGNUP</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Already Registered?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.questions}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
    },
    logo: {
      fontWeight: 'bold',
      fontSize: 50,
      color: COLORS.pink,
      marginBottom: 40,
    },
    inputView: {
      borderRadius: 10,
      backgroundColor: '#fff',
      margin: 10,
      padding: 2,
      width: '90%',
      elevation: 5,
      borderWidth: 5,
      borderColor: '#ffffff',
    },
    inputText: {
      height: 50,
      color: '#003f5c',
    },
    forgot: {
      color: '#003f5c',
      fontSize: 14,
      marginLeft: '60%',
    },
    loginBtn: {
      width: '90%',
      backgroundColor: COLORS.pink,
      borderRadius: 10,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
      marginBottom: 10,
    },
    loginText: {
      color: '#fff',
      fontSize: 20,
    },
    questions: {
      color: '#003f5c',
    },
  });
  export default Register;