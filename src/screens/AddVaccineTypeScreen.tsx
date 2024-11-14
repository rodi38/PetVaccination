import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useRequest } from '../hooks/useRequest';
import { VaccineService } from '../services/VaccineService';
import { AddVaccineTypeScreenProps } from '../types/navigation';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const AddVaccineType: React.FC<AddVaccineTypeScreenProps> = ({ navigation }) => {
	const [name, setName] = useState('');
	const { execute, isLoading, errors, generalError } = useRequest();

	const handleSubmit = async () => {
		if (!name.trim()) {
			return;
		}

		const result = await execute(() => VaccineService.createVaccine({ name: name.trim() }), {
			showFullScreenLoading: true,
			loadingText: 'Criando Vacina...',
		});

		if (result) {
			navigation.goBack();
		}
	};

	return (
		<View style={styles.container}>
			<LoadingOverlay visible={isLoading} text='Creating vaccine...' />

			<TextInput label='Nome da Vacina' value={name} onChangeText={setName} mode='outlined' style={styles.input} error={!!errors.name} />
			{errors.name && (
				<HelperText type='error' visible={true}>
					{errors.name}
				</HelperText>
			)}

			{generalError && (
				<HelperText type='error' visible={true} style={styles.generalError}>
					{generalError}
				</HelperText>
			)}

			<View style={styles.buttonRow}>
				<Button mode='outlined' onPress={() => navigation.goBack()} disabled={isLoading} style={styles.cancelButton}>
					Cancelar
				</Button>

				<Button mode='contained' onPress={handleSubmit} style={styles.button} textColor='white' disabled={isLoading || !name.trim()}>
					Cadastrar
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
		marginBottom: 4,
		backgroundColor: 'white',
	},
	generalError: {
		textAlign: 'center',
		marginBottom: 8,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 8,
		marginTop: 16,
	},
	button: {
		flex: 1,
		backgroundColor: '#2e7d32',
		color: 'white',
	},
	cancelButton: {
		flex: 1,
		borderColor: '#2e7d32',
	},
});
