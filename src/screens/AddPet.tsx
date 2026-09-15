import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, List } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AddPetScreenProps } from '../types/navigation';
import { PetService } from '../services/PetService';
import { petTypes } from '../types';
import { useRequest } from '../hooks/useRequest';
import { LoadingOverlay } from '../components/LoadingOverlay';

type PetType = keyof typeof petTypes;

export const AddPet: React.FC<AddPetScreenProps> = ({ navigation }) => {
	const [name, setName] = useState('');
	const [petType, setPetType] = useState<PetType | ''>('');
	const [breed, setBreed] = useState('');
	const [gender, setGender] = useState('');
	const [birthDate, setBirthDate] = useState<Date | null>(null);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const { execute, isLoading, errors, generalError, setErrors } = useRequest();

	const formatBirthDate = (date: Date) =>
		date.toLocaleDateString('pt-BR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});

	const breeds = {
		Dog: [
			'Labrador Retriever',
			'Pastor Alemão',
			'Golden Retriever',
			'Bulldog Inglês',
			'Poodle',
			'Beagle',
			'Rottweiler',
			'Dachshund (Teckel)',
			'Boxer',
			'Husky Siberiano',
			// ... adicione todas as raças de cachorro aqui
		],
		Cat: [
			'Persa',
			'Siamês',
			'Maine Coon',
			'Ragdoll',
			'Bengal',
			'Sphynx',
			// ... adicione todas as raças de gato aqui
		],
		Bird: [
			'Calopsita',
			'Periquito Australiano',
			'Canário',
			'Papagaio Verdadeiro',
			'Agapornis',
			// ... adicione todas as raças de pássaro aqui
		],
		Other: ['N/A'],
	};

	// Formatar dados para o SelectList
	const petTypeData = Object.entries(petTypes).map(([key, value]) => ({
		key,
		value,
	}));

	const getBreedData = () => {
		if (!petType) {
			return [];
		}
		const breedList = breeds[petType as keyof typeof breeds] || [];
		return breedList.map((breedOption) => ({
			key: breedOption,
			value: breedOption,
		}));
	};

	const genderData = [
		{ key: 'male', value: 'Macho' },
		{ key: 'female', value: 'Fêmea' },
		{ key: 'other', value: 'Outro' },
	];
	const handleSubmit = async () => {
		const newErrors: Record<string, string> = {};
		if (!name) {newErrors.name = 'Nome do pet é obrigatório';}
		if (!petType) {newErrors.petType = 'Tipo do pet é obrigatório';}
		if (!breed) {newErrors.breed = 'Raça é obrigatória';}
		if (!gender) {newErrors.gender = 'Gênero é obrigatório';}
		if (!birthDate) {newErrors.birthDate = 'Data de nascimento é obrigatória';}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		const petData = {
			name,
			petType: petTypes[petType as PetType],
			breed,
			gender,
			birthDate: birthDate!.toISOString(),
		};

		const result = await execute(() => PetService.createPet(petData), {
			showFullScreenLoading: true,
			loadingText: 'Creating pet...',
			successMessage: 'Pet cadastrado com sucesso!',
		});

		if (result) {
			navigation.goBack();
		}
	};

	return (
		<ScrollView style={styles.container}>
			<LoadingOverlay visible={isLoading} text="Creating pet..." />

			<Text style={styles.title}>Adicionar Novo Pet</Text>

			<TextInput label="Nome do Pet" value={name} onChangeText={setName} mode="outlined" style={styles.input} error={!!errors.name} />
			{errors.name && (
				<HelperText type="error" visible={true}>
					{errors.name}
				</HelperText>
			)}

			<Text style={styles.label}>Tipo de Pet</Text>
			<SelectList
				setSelected={(val: string) => {
					setPetType(val as PetType);
					setBreed('');
				}}
				data={petTypeData}
				save="key"
				placeholder="Selecionar Tipo de Pet"
				boxStyles={[styles.selectBox, errors.petType && styles.errorBorder]}
				dropdownStyles={styles.dropdown}
				search={false}
			/>
			{errors.petType && (
				<HelperText type="error" visible={true}>
					{errors.petType}
				</HelperText>
			)}

			<Text style={styles.label}>Raça</Text>
			{petType === 'Other' ? (
				<TextInput label="Breed" value={breed} onChangeText={setBreed} mode="outlined" style={styles.input} error={!!errors.breed} />
			) : (
				<SelectList setSelected={setBreed} data={getBreedData()} save="key" placeholder="Selecionar Raça" boxStyles={[styles.selectBox, errors.breed && styles.errorBorder]} dropdownStyles={styles.dropdown} search={true} searchPlaceholder="Search breed" disabled={!petType} />
			)}
			{errors.breed && (
				<HelperText type="error" visible={true}>
					{errors.breed}
				</HelperText>
			)}

			<Text style={styles.label}>Gênero</Text>
			<SelectList setSelected={setGender} data={genderData} save="key" placeholder="Selecionar Gênero" boxStyles={[styles.selectBox, errors.gender && styles.errorBorder]} dropdownStyles={styles.dropdown} search={false} />
			{errors.gender && (
				<HelperText type="error" visible={true}>
					{errors.gender}
				</HelperText>
			)}

			<Text style={styles.label}>Data de Nascimento</Text>
			<List.Item
				title={birthDate ? formatBirthDate(birthDate) : 'Selecionar data de nascimento'}
				left={(props) => <List.Icon {...props} icon="calendar" />}
				onPress={() => setShowDatePicker(true)}
				style={[styles.selectBox, errors.birthDate && styles.errorBorderThick]}
			/>
			{errors.birthDate && (
				<HelperText type="error" visible={true}>
					{errors.birthDate}
				</HelperText>
			)}

			{showDatePicker && (
				<DateTimePicker
					value={birthDate || new Date()}
					mode="date"
					display="default"
					maximumDate={new Date()}
					onChange={(event, date) => {
						setShowDatePicker(false);
						if (date) {
							setBirthDate(date);
						}
					}}
				/>
			)}

			{generalError && (
				<HelperText type="error" visible={true} style={styles.generalError}>
					{generalError}
				</HelperText>
			)}

			<View style={styles.buttonRow}>
				<Button mode="outlined" onPress={() => navigation.goBack()} disabled={isLoading} style={styles.cancelButton}>
					Cancelar
				</Button>
				<Button mode="contained" onPress={handleSubmit} loading={isLoading} disabled={isLoading} style={styles.button}>
					Cadastrar Pet
				</Button>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	errorBorder: {
		borderColor: '#ff0000',
	},
	errorBorderThick: {
		borderColor: '#ff0000',
		borderWidth: 1,
	},
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
		textAlign: 'center',
		color: '#2e7d32',
	},
	label: {
		fontSize: 16,
		color: '#666',
		marginBottom: 8,
		marginTop: 8,
	},
	input: {
		marginBottom: 4,
		backgroundColor: 'white',
	},
	selectBox: {
		borderColor: '#2e7d32',
		marginBottom: 4,
		backgroundColor: 'white',
	},
	dropdown: {
		borderColor: '#2e7d32',
		backgroundColor: 'white',
	},
	button: {
		marginTop: 10,
		backgroundColor: '#2e7d32',
		flex: 1, // Faz com que cada botão ocupe o mesmo espaço
	},
	cancelButton: {
		marginTop: 10,
		borderColor: '#2e7d32',
		flex: 1, // Faz com que cada botão ocupe o mesmo espaço
	},
	generalError: {
		marginBottom: 8,
		textAlign: 'center',
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between', // Distribui os botões igualmente
		gap: 8,
	},
});
