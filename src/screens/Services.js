import {View, Text, Image} from 'react-native';
import {COLORS} from '../assets/theme/Color';
import {useMyContextController} from '../context';
import {logo} from '../../constants/images';
import {useEffect} from 'react';

export default Services = ({navigation}) => {
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  useEffect(() => {
    if (userLogin == null) navigation.navigate('Login');
  }, [userLogin]);

  return (
    <View>
      <Text>Services</Text>
    </View>
  );
};