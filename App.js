import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { MyContextControllerProvider } from './src/context';
import Router from './src/screens/Router';
import { StatusBar } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();

const initial = async () => {
  const USERS = firestore().collection('USERS');
  const admin = {
    name: 'admin',
    phone: '01234567890',
    address: 'BD',
    email: 'ledat4657@gmail.com',
    password: 'leanhdat76fc',
    role: 'admin',
  };

  try {
    const userSnapshot = await USERS.doc(admin.email).get();
    if (!userSnapshot.exists) {
      await auth().createUserWithEmailAndPassword(admin.email, admin.password);
      await USERS.doc(admin.email).set(admin);
      console.log('Added new admin user.');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};

const App = () => {
  useEffect(() => {
    initial();
  }, []);

  return (
    <PaperProvider>
      <MyContextControllerProvider>
        <NavigationContainer>
          <StatusBar />
          <Stack.Navigator>
            <Stack.Screen name="Router" component={Router} />
          </Stack.Navigator>
        </NavigationContainer>
      </MyContextControllerProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
