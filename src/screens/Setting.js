import {Settings, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useMyContextController, logout} from '../context';
import {useEffect} from 'react';
import COLORS from '../assets/theme/Color';

export default Setting = ({navigation}) => {
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  useEffect(() => {
    if (userLogin == null) navigation.navigate('Login');
  }, [userLogin]);
  const onSubmit = () => {
    logout(dispatch);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.loginBtn}
        mode="contained"
        onPress={onSubmit}>
        <Text style={styles.loginText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});