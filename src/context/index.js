import { createContext, useContext, useMemo, useReducer } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

// Create a context for the app
const MyContext = createContext();
MyContext.displayName = 'MyContextContext';

// Reducer function to manage the state
function reducer(state, action) {
  switch (action.type) {
    case 'USER_LOGIN': {
      return { ...state, userLogin: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// Provider component to wrap around parts of the app that need access to this context
function MyContextControllerProvider({ children }) {
  const initialState = {
    userLogin: null,
  };
  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

// Custom hook to use the context
function useMyContextController() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContextController should be used inside the MyContextControllerProvider');
  }
  return context;
}

// Firestore collections
const USERS = firestore().collection('USERS');
const SERVICES = firestore().collection('services');

// Function to login a user
const login = (dispatch, email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() =>
      USERS.doc(email).onSnapshot(u => {
        const value = u.data();
        console.log('Đăng nhập thành công với User : ', value);
        dispatch({ type: 'USER_LOGIN', value });
      })
    )
    .catch(e => alert('Sai user và Password'));
};

// Function to logout a user
const logout = dispatch => {
  dispatch({ type: 'USER_LOGIN', value: null });
};

// Function to create a new service
const createNewService = newService => {
  newService.finalUpdate = firestore.FieldValue.serverTimestamp();
  SERVICES.add(newService)
    .then(() => {
      console.log('Service added successfully');
      Alert.alert('Success', 'Add new service successfully !!!');
    })
    .catch(e => {
      console.error('Error adding service:', e);
      Alert.alert('Error', e.message);
    });
};

// Function to update an existing service
const updateService = async (id, updatedService) => {
  updatedService.finalUpdate = firestore.FieldValue.serverTimestamp();
  await SERVICES.doc(id)
    .update(updatedService)
    .then(() => {
      alert('Service updated successfully !!!');
    })
    .catch(e => {
      alert(e.message);
    });
};

// Function to confirm a payment
const payConfirm = async (userName, serviceName, servicePrice) => {
  try {
    await firestore().collection('history').add({
      userName,
      serviceName,
      servicePrice,
      paymentDate: new Date(),
    });
    console.log('Thanh toán thành công!');
    return true;
  } catch (error) {
    console.error('Lỗi khi thanh toán:', error);
    return false;
  }
};

// Function to delete a service
const deleteService = async id => {
  try {
    await SERVICES.doc(id).delete();
    console.log('Service deleted successfully');
    Alert.alert('Success', 'Service deleted successfully!');
  } catch (error) {
    console.error('Error deleting service:', error);
    Alert.alert('Error', error.message);
  }
};

export {
  MyContextControllerProvider,
  useMyContextController,
  createNewService,
  login,
  logout,
  updateService,
  payConfirm,
  deleteService,
};
