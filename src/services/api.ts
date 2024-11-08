import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const local = 'http://192.168.18.6:4245';
const prod = 'https://petvacapi.onrender.com';

const api = axios.create({
	baseURL: local, // Altere para seu IP local quando necessário
});

let authTokens = {
	token: null as string | null,
};

api.interceptors.request.use(async (config) => {
	if (!authTokens.token) {
		authTokens.token = await AsyncStorage.getItem('@token');
	}

	if (authTokens.token) {
		config.headers.Authorization = `Bearer ${authTokens.token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			// Token expirado ou inválido
			authTokens.token = null;
			await AsyncStorage.removeItem('@token');
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
