import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { NavigationProp, RegisterScreenProps } from '../types/navigation';

export const Register = ({ navigation }: RegisterScreenProps) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { register } = useAuth();

	const handleRegister = async () => {
		try {
			await register(username, email, password);
			navigation.navigate('Login');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Create Account</Text>
			<TextInput label='Username' value={username} onChangeText={setUsername} mode='outlined' style={styles.input} />
			<TextInput label='Email' value={email} onChangeText={setEmail} mode='outlined' style={styles.input} />
			<TextInput label='Password' value={password} onChangeText={setPassword} secureTextEntry mode='outlined' style={styles.input} />
			<Button mode='contained' onPress={handleRegister} style={styles.button}>
				Register
			</Button>
			<Button mode='text' onPress={() => navigation.goBack()}>
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
		marginBottom: 10,
	},
	button: {
		marginTop: 10,
		backgroundColor: '#2e7d32',
	},
});
