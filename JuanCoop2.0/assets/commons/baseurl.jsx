import { Platform } from 'react-native';
import Constants from 'expo-constants';
let baseURL = '';

{Platform.OS === 'android' || Platform.OS === 'ios'
? baseURL = `http://192.168.100.5:4000/api/v2/`
: baseURL = `${config.BASE_ADDRESS_1}`
}

export default baseURL;
