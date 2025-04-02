import { Platform } from 'react-native';
import Constants from 'expo-constants';
let baseURL = '';

{Platform.OS === 'android' || Platform.OS === 'ios'
? baseURL = Constants?.expoConfig?.extra?.RENDER_ADDRESS
: baseURL = `${Constants?.expoConfig?.extra?.RENDER_ADDRESS}`
}

export default baseURL;
