import React, {useState, useContext} from 'react';
import {View,Text,Button,StyleSheet,Image,TouchableOpacity,} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {payConfirm} from '../context';
import {useMyContextController} from '../context';
import COLORS from '../assets/theme/Color';

const ConfirmOrder = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {serviceName, servicePrice, imageUrl} = route.params;

  const [controller] = useMyContextController();
  const {userLogin} = controller;

  const [confirming, setConfirming] = useState(false);

  const userName = userLogin ? userLogin.name : 'Tên người dùng mẫu';

  const handleConfirm = async () => {
    try {
      setConfirming(true);

      const paymentSuccess = await payConfirm(
        userName,
        serviceName,
        servicePrice,
      );

      if (paymentSuccess) {
        console.log('Thanh toán thành công!');
        navigation.navigate('Home');
      } else {
        console.log('Thanh toán thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi xác nhận thanh toán:', error);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <View style={styles.container}>
      {imageUrl && <Image source={{uri: imageUrl}} style={styles.image} />}
      <Text style={styles.label}>Dịch vụ: {serviceName}</Text>
      <Text style={styles.label}>Giá dịch vụ: {servicePrice}</Text>
      <TouchableOpacity
        style={[styles.loginBtn, confirming && styles.disabledBtn]}
        onPress={handleConfirm}
        disabled={confirming}>
        <Text style={styles.loginText}>
          {confirming ? 'Đang xác nhận...' : 'Xác nhận'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});
export default ConfirmOrder;