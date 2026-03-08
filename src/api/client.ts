import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚙️ CHANGE THIS to your Laravel server URL
export const BASE_URL = 'http://192.168.1.100:8000'; // or your production URL

const client = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 15000,
});

// Attach auth token to every request
client.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors globally (token expired / invalid)
client.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('auth_user');
            // navigation will be handled by auth store listener
        }
        return Promise.reject(error);
    },
);

export default client;
