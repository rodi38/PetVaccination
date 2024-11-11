import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService } from '../services/AuthService';
import { User } from '../types/index';

// interface User {
// 	_id: string;
// 	username: string;
// 	email: string;
// }

interface AuthContextData {
	user: User | null;
	loading: boolean;
	signIn(email: string, password: string): Promise<void>;
	signOut(): Promise<void>;
	register(username: string, email: string, password: string): Promise<void>;
	updateUserContext(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

declare global {
	var forceLogout: (() => Promise<void>) | null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadStorageData();
	}, []);

	async function loadStorageData() {
		try {
			const authData = await AuthService.loadAuthData();

			if (authData) {
				setUser(authData.user);
			}
		} catch (error) {
			console.error('Error loading storage data:', error);
		} finally {
			setLoading(false);
		}
	}

	const signIn = async (email: string, password: string) => {
		try {
			const { user } = await AuthService.login(email, password);
			setUser(user);
		} catch (error) {
			throw error;
		}
	};

	const signOut = async () => {
		try {
			await AuthService.logout();
			setUser(null);
		} catch (error) {
			console.error('Error during signOut:', error);
		}
	};

	const register = async (username: string, email: string, password: string) => {
		try {
			await AuthService.register(username, email, password);
		} catch (error) {
			throw error;
		}
	};

	global.forceLogout = signOut;

	const updateUserContext = (updatedUser: User) => {
		setUser(updatedUser);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				signIn,
				signOut,
				register,
				updateUserContext, // Adicione esta linha
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
