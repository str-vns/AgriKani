import { Platform } from 'react-native';
import config from "@config"
console.log(config.BASE_ADDRESS, "config");
let baseURL = '';

{Platform.OS === 'android' || Platform.OS === 'ios'
? baseURL = `http://192.168.50.236:4000/api/v2/`
: baseURL = `${config.BASE_ADDRESS_1}`
}

export default baseURL;

// https://agrikani.onrender.com/api/v2/
// http://192.168.50.236:4000/api/v2/