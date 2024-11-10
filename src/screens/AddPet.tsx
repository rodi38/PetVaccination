import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import { AddPetScreenProps } from '../types/navigation';
import { PetService } from '../services/PetService';
import { useAuth } from '../contexts/AuthContext';
import { petTypes } from '../types';
import { useRequest } from '../hooks/useRequest';
import { LoadingOverlay } from '../components/LoadingOverlay';

type PetType = keyof typeof petTypes;

export const AddPet: React.FC<AddPetScreenProps> = ({ navigation }) => {
	const { user } = useAuth();
	const [name, setName] = useState('');
	const [petType, setPetType] = useState<PetType | ''>('');
	const [breed, setBreed] = useState('');
	const [gender, setGender] = useState('');
	const [age, setAge] = useState('');
	const { execute, isLoading, errors, generalError } = useRequest();

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
		return breedList.map((breed) => ({
			key: breed,
			value: breed,
		}));
	};

	const genderData = [
		{ key: 'male', value: 'Male' },
		{ key: 'female', value: 'Female' },
		{ key: 'other', value: 'Other' },
	];
	const handleSubmit = async () => {
		if (!name || !petType || !breed || !gender || !age) {
			return;
		}

		const ageNumber = parseInt(age);
		if (isNaN(ageNumber) || ageNumber < 0) {
			return;
		}

		const petData = {
			name,
			petType: petTypes[petType as PetType],
			breed,
			gender,
			age: ageNumber,
			owner: user?._id,
		};

		const result = await execute(() => PetService.createPet(petData), {
			showFullScreenLoading: true,
			loadingText: 'Creating pet...',
		});

		if (result) {
			navigation.goBack();
		}
	};

	return (
		<ScrollView style={styles.container}>
			<LoadingOverlay visible={isLoading} text='Creating pet...' />

			<Text style={styles.title}>Add New Pet</Text>

			<TextInput label='Pet Name' value={name} onChangeText={setName} mode='outlined' style={styles.input} error={!!errors.name} />
			{errors.name && (
				<HelperText type='error' visible={true}>
					{errors.name}
				</HelperText>
			)}

			<Text style={styles.label}>Pet Type</Text>
			<SelectList
				setSelected={(val: string) => {
					setPetType(val as PetType);
					setBreed('');
				}}
				data={petTypeData}
				save='key'
				placeholder='Select pet type'
				boxStyles={[styles.selectBox, errors.petType && { borderColor: '#ff0000' }]}
				dropdownStyles={styles.dropdown}
				search={false}
			/>
			{errors.petType && (
				<HelperText type='error' visible={true}>
					{errors.petType}
				</HelperText>
			)}

			<Text style={styles.label}>Breed</Text>
			{petType === 'Other' ? (
				<TextInput label='Breed' value={breed} onChangeText={setBreed} mode='outlined' style={styles.input} error={!!errors.breed} />
			) : (
				<SelectList setSelected={setBreed} data={getBreedData()} save='key' placeholder='Select breed' boxStyles={[styles.selectBox, errors.breed && { borderColor: '#ff0000' }]} dropdownStyles={styles.dropdown} search={true} searchPlaceholder='Search breed' disabled={!petType} />
			)}
			{errors.breed && (
				<HelperText type='error' visible={true}>
					{errors.breed}
				</HelperText>
			)}

			<Text style={styles.label}>Gender</Text>
			<SelectList setSelected={setGender} data={genderData} save='key' placeholder='Select gender' boxStyles={[styles.selectBox, errors.gender && { borderColor: '#ff0000' }]} dropdownStyles={styles.dropdown} search={false} />
			{errors.gender && (
				<HelperText type='error' visible={true}>
					{errors.gender}
				</HelperText>
			)}

			<TextInput label='Age' value={age} onChangeText={setAge} keyboardType='numeric' mode='outlined' style={styles.input} error={!!errors.age} />
			{errors.age && (
				<HelperText type='error' visible={true}>
					{errors.age}
				</HelperText>
			)}

			{generalError && (
				<HelperText type='error' visible={true} style={styles.generalError}>
					{generalError}
				</HelperText>
			)}

			<View style={styles.buttonRow}>
				<Button mode='outlined' onPress={() => navigation.goBack()} disabled={isLoading} style={styles.cancelButton}>
					Cancel
				</Button>
				<Button mode='contained' onPress={handleSubmit} loading={isLoading} disabled={isLoading} style={styles.button}>
					Add Pet
				</Button>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
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
