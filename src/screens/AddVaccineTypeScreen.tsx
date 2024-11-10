import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useRequest } from '../hooks/useRequest';
import { VaccineService } from '../services/VaccineService';
import { AddVaccineTypeScreenProps } from '../types/navigation';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const AddVaccineType: React.FC<AddVaccineTypeScreenProps> = ({ navigation }) => {
	const [name, setName] = useState('');
	const { execute, isLoading, error } = useRequest();

	const handleSubmit = async () => {
		if (!name.trim()) {
			return;
		}

		await execute(async () => {
			try {
				await VaccineService.createVaccine({ name });
				navigation.goBack();
			} catch (error) {
				console.error('Error creating vaccine:', error);
			}
		});
	};

	return (
		<View style={styles.container}>
			<LoadingOverlay visible={isLoading} text='Creating vaccine...' />

			<TextInput label='Vaccine Name' value={name} onChangeText={setName} mode='outlined' style={styles.input} />

			{error && (
				<HelperText type='error' visible={true}>
					{error}
				</HelperText>
			)}
			<View style={styles.buttonRow}>
				<Button mode='outlined' onPress={() => navigation.goBack()} disabled={isLoading} style={styles.cancelButton}>
					Cancel
				</Button>
				<Button mode='contained' onPress={handleSubmit} style={styles.button} disabled={isLoading || !name.trim()}>
					Create
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#f5f5f5',
	},
	input: {
		marginBottom: 16,
		backgroundColor: 'white',
	},
	button: {
		marginTop: 10,
		backgroundColor: '#2e7d32',
		flex: 1,
		color: 'white',
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between', // Distribui os botões igualmente
		gap: 8,
	},
	cancelButton: {
		marginTop: 10,
		borderColor: '#2e7d32',
		flex: 1, // Faz com que cada botão ocupe o mesmo espaço
	},
});
