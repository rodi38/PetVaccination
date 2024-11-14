import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreenProps } from '../types/navigation';
import { useRequest } from '../hooks/useRequest';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const Login = ({ navigation }: LoginScreenProps) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { signIn } = useAuth();
	const { execute, isLoading, errors, generalError } = useRequest();

	const handleLogin = async () => {
		if (!email || !password) {
			return;
		}

		const result = await execute(() => signIn(email, password), {
			showFullScreenLoading: true,
			loadingText: 'Signing in...',
		});

		// Se o login for bem-sucedido, o AuthContext já vai redirecionar automaticamente
		// devido à mudança no estado do usuário
	};

	return (
		<View style={styles.container}>
			<LoadingOverlay visible={isLoading} text='Signing in...' />

			<Text style={styles.title}>Diario de Pet</Text>

			<TextInput label='Email' value={email} onChangeText={setEmail} mode='outlined' style={styles.input} error={!!errors.email} keyboardType='email-address' autoCapitalize='none' />
			{errors.email && (
				<HelperText type='error' visible={true}>
					{errors.email}
				</HelperText>
			)}

			<TextInput label='Senha' value={password} onChangeText={setPassword} secureTextEntry mode='outlined' style={styles.input} error={!!errors.password} autoCapitalize='none' />
			{errors.password && (
				<HelperText type='error' visible={true}>
					{errors.password}
				</HelperText>
			)}

			{generalError && (
				<HelperText type='error' visible={true} style={styles.generalError}>
					{generalError}
				</HelperText>
			)}

			<Button mode='contained' onPress={handleLogin} loading={isLoading} disabled={isLoading} style={styles.button}>
				Entrar
			</Button>

			<Button mode='text' onPress={() => navigation.navigate('Register')} disabled={isLoading}>
				Não tem uma conta? Registrar
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
		backgroundColor: '#f5f5f5',
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
		textAlign: 'center',
		color: '#2e7d32',
	},
	input: {
		marginBottom: 4,
	},
	generalError: {
		marginBottom: 8,
		textAlign: 'center',
	},
	button: {
		marginTop: 16,
		marginBottom: 8,
		backgroundColor: '#2e7d32',
	},
});
