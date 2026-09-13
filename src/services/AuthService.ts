import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import api, { setAuthToken } from './api';
import { User } from '../types/index';

interface TokenPayload {
	exp: number;
	sub: string; // ou qualquer outro campo que seu token contenha
}

interface UpdateUserDTO {
	username?: string;
	email?: string;
	currentPassword?: string;
	newPassword?: string;
}

export class AuthService {
	static isTokenExpired(token: string): boolean {
		try {
			const decoded = jwtDecode<TokenPayload>(token);
			const currentTime = Date.now() / 1000;
			return decoded.exp < currentTime;
		} catch {
			return true;
		}
	}

	static async login(email: string, password: string) {
		try {
			const response = await api.post('/auth/login', { email, password });
			const { user, token } = response.data;

			await this.saveAuthData(user, token);

			return { user, token };
		} catch (error) {
			throw error;
		}
	}

	static async register(username: string, email: string, password: string) {
		try {
			await api.post('/auth/register', { username, email, password });
		} catch (error) {
			throw error;
		}
	}

	static async updateUser(userId: string, data: UpdateUserDTO) {
		const response = await api.put(`/auth/users/${userId}`, data);
		const updatedUser = response.data;
		await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
		return updatedUser;
	}

	static async logout() {
		try {
			await AsyncStorage.removeItem('@user');
			await setAuthToken(null);
		} catch (error) {
			console.error('Error during logout:', error);
			throw error;
		}
	}

	static async saveAuthData(user: User, token: string) {
		try {
			await AsyncStorage.setItem('@user', JSON.stringify(user));
			await setAuthToken(token);
		} catch (error) {
			console.error('Error saving auth data:', error);
			throw error;
		}
	}

	static async loadAuthData() {
		try {
			const [userString, token] = await AsyncStorage.multiGet(['@user', '@token']);

			if (!userString[1] || !token[1]) {
				return null;
			}

			// Verifica se o token está expirado
			if (this.isTokenExpired(token[1])) {
				await this.logout();
				return null;
			}

			// Se o token é válido, configura o header e retorna os dados
			api.defaults.headers.common.Authorization = `Bearer ${token[1]}`;
			return {
				user: JSON.parse(userString[1]),
				token: token[1],
			};
		} catch (error) {
			console.error('Error loading auth data:', error);
			return null;
		}
	}
}
