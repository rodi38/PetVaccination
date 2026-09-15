import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

const api = axios.create({
	baseURL: Config.API_URL,
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
	(response) => {
		// O backend sempre responde no formato { success, data, error };
		// desembrulhamos aqui pra quem consome `api` continuar lendo `response.data` normalmente.
		if (response.data && typeof response.data === 'object' && 'success' in response.data) {
			response.data = response.data.data;
		}
		return response;
	},
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
