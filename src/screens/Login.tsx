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
	const { execute, isLoading, error } = useRequest();

	const handleLogin = async () => {
		if (!email || !password) {
			return;
		}

		await execute(() => signIn(email, password), {
			showFullScreenLoading: true,
			loadingText: 'Signing in...',
		});
	};

	return (
		<View style={styles.container}>
			<LoadingOverlay visible={isLoading} text='Signing in...' />

			<Text style={styles.title}>Pet Vaccination</Text>
			<TextInput label='Email' value={email} onChangeText={setEmail} mode='outlined' style={styles.input} />
			<TextInput label='Password' value={password} onChangeText={setPassword} secureTextEntry mode='outlined' style={styles.input} />
			{error && (
				<HelperText type='error' visible={true}>
					{error}
				</HelperText>
			)}

			<Button mode='contained' onPress={handleLogin} loading={isLoading} disabled={isLoading} style={styles.button}>
				Login
			</Button>

			<Button mode='text' onPress={() => navigation.navigate('Register')} disabled={isLoading}>
				Don't have an account? Register
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
		marginBottom: 10,
	},
	button: {
		marginTop: 10,
		backgroundColor: '#2e7d32',
	},
});
