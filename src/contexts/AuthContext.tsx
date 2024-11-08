import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
	_id: string;
	username: string;
	email: string;
}

interface AuthContextData {
	user: User | null;
	loading: boolean;
	signIn(email: string, password: string): Promise<void>;
	signOut(): Promise<void>;
	register(username: string, email: string, password: string): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

declare global {
	var forceLogout: (() => Promise<void>) | null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const signOut = async () => {
		await AsyncStorage.multiRemove(['@user', '@token']);
		setUser(null);
	};

	// Registrar função global de logout forçado
	global.forceLogout = signOut;

	useEffect(() => {
		async function loadStorageData() {
			try {
				const [storedUser, storedToken] = await AsyncStorage.multiGet(['@user', '@token']);

				if (storedUser[1] && storedToken[1]) {
					setUser(JSON.parse(storedUser[1]));
					api.defaults.headers.common.Authorization = `Bearer ${storedToken[1]}`;

					// Validar token com o backend
					try {
						await api.get('/auth/validate');
					} catch (error) {
						// Se o token for inválido, fazer logout
						await signOut();
					}
				}
			} catch (error) {
				console.error('Error loading storage data:', error);
			} finally {
				setLoading(false);
			}
		}

		loadStorageData();
	}, []);

	const signIn = async (email: string, password: string) => {
		try {
			const response = await api.post('/auth/login', { email, password });
			const { user, token } = response.data;

			await AsyncStorage.multiSet([
				['@user', JSON.stringify(user)],
				['@token', token],
			]);

			api.defaults.headers.common.Authorization = `Bearer ${token}`;
			setUser(user);
		} catch (error) {
			throw error;
		}
	};

	const register = async (username: string, email: string, password: string) => {
		try {
			await api.post('/auth/register', { username, email, password });
		} catch (error) {
			throw error;
		}
	};

	return <AuthContext.Provider value={{ user, loading, signIn, signOut, register }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
