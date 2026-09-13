import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const local = 'http://10.0.2.2:5000'; // Altere para seu IP local quando necessário
const prod = 'https://petvacapi.onrender.com';

const api = axios.create({
	baseURL: local, // Altere para seu IP local quando necessário
});

export const setAuthToken = async (token: string | null) => {
	if (token) {
		await AsyncStorage.setItem('@token', token);
		api.defaults.headers.common.Authorization = `Bearer ${token}`;
	} else {
		await AsyncStorage.removeItem('@token');
		delete api.defaults.headers.common.Authorization;
	}
};

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			// Token expirado ou inválido
			await setAuthToken(null);
			await AsyncStorage.removeItem('@user');

			// Forçar atualização do app
			if (global.forceLogout) {
				global.forceLogout();
			}
		}
		return Promise.reject(error);
	},
);

export default api;
