import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { NavigationProp, RegisterScreenProps } from '../types/navigation';
import { useRequest } from '../hooks/useRequest';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const Register = ({ navigation }: RegisterScreenProps) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { register } = useAuth();
	const { execute, isLoading, errors, generalError } = useRequest();

	const handleRegister = async () => {
		if (!email || !password || !username) {
			return;
		}

		const result = await execute(() => register(username, email, password), {
			showFullScreenLoading: true,
			loadingText: 'Creating account...',
		});

		if (result) {
			navigation.navigate('Login');
		}
	};

	return (
		<View style={styles.container}>
			<LoadingOverlay visible={isLoading} text='Signing in...' />
			<Text style={styles.title}>Create Account</Text>

			<TextInput label='Username' value={username} onChangeText={setUsername} mode='outlined' style={styles.input} error={!!errors.username} />
			{errors.username && (
				<HelperText type='error' visible={true}>
					{errors.username}
				</HelperText>
			)}

			<TextInput label='Email' value={email} onChangeText={setEmail} mode='outlined' style={styles.input} error={!!errors.email} />
			{errors.email && (
				<HelperText type='error' visible={true}>
					{errors.email}
				</HelperText>
			)}

			<TextInput label='Password' value={password} onChangeText={setPassword} secureTextEntry mode='outlined' style={styles.input} error={!!errors.password} />
			{errors.password && (
				<HelperText type='error' visible={true}>
					{errors.password}
				</HelperText>
			)}

			{generalError && (
				<HelperText type='error' visible={true}>
					{generalError}
				</HelperText>
			)}

			<Button mode='contained' onPress={handleRegister} loading={isLoading} disabled={isLoading} style={styles.button}>
				Register
			</Button>

			<Button mode='text' disabled={isLoading} onPress={() => navigation.goBack()}>
				Already have an account? Login
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
	button: {
		marginTop: 16,
		backgroundColor: '#2e7d32',
	},
});
