import { Platform } from 'react-native';
import config from "@config"
console.log(config.BASE_ADDRESS, "config");
let baseURL = '';

{Platform.OS === 'android' || Platform.OS === 'ios'
? baseURL = `https://agrikani.onrender.com/api/v2/`
: baseURL = `${config.BASE_ADDRESS_1}`
}

export default baseURL;