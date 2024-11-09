// import React, { useState } from 'react';
// import { View, StyleSheet, ScrollView } from 'react-native';
// import { TextInput, Button, Text, HelperText, SegmentedButtons, Portal, Modal, List, Divider, IconButton, Searchbar } from 'react-native-paper';
// import { AddPetScreenProps } from '../types/navigation';
// import { PetService } from '../services/PetService';
// import { useAuth } from '../contexts/AuthContext';
// import { petTypes } from '../types';

// type PetType = keyof typeof petTypes;

// export const AddPet: React.FC<AddPetScreenProps> = ({ navigation }) => {
// 	const { user } = useAuth();
// 	const [name, setName] = useState('');
// 	const [petType, setPetType] = useState<PetType | ''>('');
// 	const [breedModalVisible, setBreedModalVisible] = useState(false);
// 	const [breedSearch, setBreedSearch] = useState('');
// 	const [breed, setBreed] = useState('');
// 	const [gender, setGender] = useState('');
// 	const [age, setAge] = useState('');
// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState('');

// 	const breeds = {
// 		DogBreed: [
// 			'Labrador Retriever',
// 			'Pastor Alemão',
// 			'Golden Retriever',
// 			'Bulldog Inglês',
// 			'Poodle',
// 			'Beagle',
// 			'Rottweiler',
// 			'Dachshund (Teckel)',
// 			'Boxer',
// 			'Husky Siberiano',
// 			'Chihuahua',
// 			'Dog Alemão',
// 			'Shih Tzu',
// 			'Dobermann',
// 			'Border Collie',
// 			'Yorkshire Terrier',
// 			'Cocker Spaniel Inglês',
// 			'Pastor Australiano',
// 			'Pug',
// 			'Bichon Frisé',
// 			'Bulldog Francês',
// 			'Cavalier King Charles Spaniel',
// 			'Akita Inu',
// 			'Maltês',
// 			'Pastor de Shetland',
// 			'Boston Terrier',
// 			'Bernese Mountain Dog (Boiadeiro Bernês)',
// 			'Shiba Inu',
// 			'Malamute do Alasca',
// 			'Weimaraner',
// 			'São Bernardo',
// 			'Spaniel Springer Inglês',
// 			'Havanês',
// 			'Bull Terrier',
// 			'Dálmata',
// 			'Setter Irlandês',
// 			'Terra Nova',
// 			'Pequinês',
// 			'Whippet',
// 			'Papillon',
// 			'Jack Russell Terrier',
// 			'Chow Chow',
// 			'Rhodesian Ridgeback',
// 			'Cane Corso',
// 			'Airedale Terrier',
// 			'Lhasa Apso',
// 			'Samoyeda',
// 			'Basset Hound',
// 			'Scottish Terrier (Terrier Escocês)',
// 			'Schnauzer Miniatura',
// 			'Staffordshire Terrier Americano',
// 			'Elkhound Norueguês',
// 			'Basenji',
// 			'Pastor Belga Malinois',
// 			'Lobão Irlandês (Irish Wolfhound)',
// 			'Cão de Água Português',
// 			'Galgo Italiano',
// 			'Keeshond',
// 			'Brittany (Epagneul Breton)',
// 			'Old English Sheepdog (Bobtail)',
// 			'Spitz Alemão (ou Lulu da Pomerânia)',
// 			'Greyhound (Galgo Inglês)',
// 			'Cairn Terrier',
// 			'Afghan Hound (Galgo Afegão)',
// 			'Wheaten Terrier de Pêlo Macio',
// 			'Fox Terrier de Pêlo Duro',
// 			'Mastim Tibetano',
// 			'Norwich Terrier',
// 			'Spitz Americano',
// 			'Boiadeiro Australiano',
// 			'Spaniel Japonês (ou Chin Japonês)',
// 			'Corgi Galês Pembroke',
// 			'Corgi Galês Cardigan',
// 			'Pointer',
// 			'Vizsla (Braco Húngaro)',
// 			'Collie',
// 			'Retriever de Pêlo Liso',
// 			'Schnauzer Gigante',
// 			'Pharaoh Hound (Cão do Faraó)',
// 			'Bloodhound (Cão de Santo Humberto)',
// 			'Boerboel',
// 			'Mastim Inglês',
// 			'Kerry Blue Terrier',
// 			'Leonberger',
// 			'Saluki',
// 			'Terrier Tibetano',
// 			'N/A',
// 		],

// 		CatBreed: [
// 			'Persa',
// 			'Siamês',
// 			'Maine Coon',
// 			'Ragdoll',
// 			'Bengal',
// 			'Sphynx',
// 			'Britânico de Pelo Curto',
// 			'Abissínio',
// 			'Birmanês (Birman)',
// 			'Russian Blue (Azul Russo)',
// 			'Chartreux',
// 			'Himalaio',
// 			'Norueguês da Floresta',
// 			'Scottish Fold',
// 			'Savannah',
// 			'American Shorthair (Americano de Pelo Curto)',
// 			'Oriental de Pelo Curto',
// 			'Devon Rex',
// 			'Cornish Rex',
// 			'Angorá Turco',
// 			'Selkirk Rex',
// 			'Bombaim',
// 			'Ocicat',
// 			'Manx',
// 			'Snowshoe',
// 			'Tonquinês',
// 			'Somali',
// 			'Laperm',
// 			'Toyger',
// 			'Singapura',
// 			'Balinês',
// 			'Burmilla',
// 			'Munchkin',
// 			'Korat',
// 			'Siberiano',
// 			'Bobtail Japonês',
// 			'Peterbald',
// 			'Van Turco',
// 			'Egyptian Mau',
// 			'Chantilly-Tiffany',
// 			'Pixie-bob',
// 			'Cymric',
// 			'American Curl',
// 			'Havana Brown',
// 			'Lykoi',
// 			'N/A',
// 		],

// 		BirdBreed: [
// 			'Calopsita',
// 			'Periquito Australiano',
// 			'Canário',
// 			'Papagaio Verdadeiro',
// 			'Agapornis (Inseparável)',
// 			'Cacatua',
// 			'Arara Azul',
// 			'Arara Canindé',
// 			'Pintassilgo',
// 			'Curió',
// 			'Coleiro',
// 			'Sabiá Laranjeira',
// 			'Tucano Toco',
// 			'Maritaca',
// 			'Mandarim',
// 			'Mainá',
// 			'Diamante Gould',
// 			'Cardeal do Sul',
// 			'Manon',
// 			'Rosela',
// 			'Forpus (Tuim)',
// 			'Ring Neck',
// 			'Pardal',
// 			'Jandaia',
// 			'Lóris',
// 			'Cacatua Galah',
// 			'Bicudo',
// 			'Tico-tico',
// 			'Bem-te-vi',
// 			'Trinca-ferro',
// 			'Beija-flor',
// 			'Faisão Dourado',
// 			'Pomba Diamante',
// 			'Galo da Serra',
// 			'Araçari',
// 			'Canário da Terra',
// 			'Corrupião',
// 			'Saíra Sete Cores',
// 			'Tico-tico Rei',
// 			'Tangará',
// 			'N/A',
// 		],
// 	};

// 	const genders = {
// 		Male: 'male',
// 		Female: 'female',
// 		Other: 'other',
// 	};

// 	const getBreedOptions = () => {
// 		if (!petType || petType === '') {
// 			return [];
// 		}
// 		return breeds[petType] || [];
// 	};

// 	const filteredBreeds = getBreedOptions().filter((b) => b.toLowerCase().includes(breedSearch.toLowerCase()));

// 	const handleSubmit = async () => {
// 		try {
// 			setLoading(true);
// 			setError('');

// 			if (!name || !petType || !breed || !gender || !age) {
// 				setError('Please fill in all fields');
// 				return;
// 			}

// 			const ageNumber = parseInt(age);
// 			if (isNaN(ageNumber) || ageNumber < 0) {
// 				setError('Please enter a valid age');
// 				return;
// 			}

// 			const petData = {
// 				name,
// 				petType: petTypes[petType],
// 				breed,
// 				gender,
// 				age: ageNumber,
// 				owner: user?._id,
// 			};

// 			await PetService.createPet(petData);
// 			navigation.navigate('Home');
// 		} catch (err) {
// 			console.error('Error creating pet:', err);
// 			setError('Error creating pet. Please try again.');
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<ScrollView style={styles.container}>
// 			<Text style={styles.title}>Add New Pet</Text>

// 			<TextInput label='Pet Name' value={name} onChangeText={setName} mode='outlined' style={styles.input} />

// 			<Text style={styles.label}>Pet Type</Text>
// 			<SegmentedButtons
// 				value={petType}
// 				onValueChange={(value) => {
// 					setPetType(value as PetType);
// 					setBreed('');
// 				}}
// 				buttons={Object.keys(petTypes).map((key) => ({
// 					value: key,
// 					label: petTypes[key as PetType],
// 					style: petType === key ? styles.selectedSegment : styles.segment,
// 					checkedColor: '#2e7d32',
// 				}))}
// 				style={styles.segmentedButton}
// 			/>

// 			{petType === 'Other' ? (
// 				<TextInput label='Breed' value={breed} onChangeText={setBreed} mode='outlined' style={styles.input} />
// 			) : (
// 				<TextInput label='Breed' value={breed} mode='outlined' style={styles.input} right={<TextInput.Icon icon='chevron-down' onPress={() => setBreedModalVisible(true)} />} onPressIn={() => setBreedModalVisible(true)} editable={false} disabled={!petType} />
// 			)}

// 			<Text style={styles.label}>Gender</Text>
// 			<SegmentedButtons
// 				value={gender}
// 				onValueChange={setGender}
// 				buttons={[
// 					{ value: 'male', label: 'Male' },
// 					{ value: 'female', label: 'Female' },
// 					{ value: 'other', label: 'Other' },
// 				].map((item) => ({
// 					...item,
// 					style: gender === item.value ? styles.selectedSegment : styles.segment,
// 					checkedColor: '#2e7d32',
// 				}))}
// 				style={styles.segmentedButton}
// 			/>

// 			<TextInput label='Age' value={age} onChangeText={setAge} keyboardType='numeric' mode='outlined' style={styles.input} />

// 			{error ? (
// 				<HelperText type='error' visible={!!error}>
// 					{error}
// 				</HelperText>
// 			) : null}

// 			<Button mode='contained' onPress={handleSubmit} loading={loading} disabled={loading} style={styles.button}>
// 				Add Pet
// 			</Button>

// 			<Button mode='outlined' onPress={() => navigation.goBack()} disabled={loading} style={styles.cancelButton}>
// 				Cancel
// 			</Button>

// 			<Modal visible={breedModalVisible} onDismiss={() => setBreedModalVisible(false)} style={styles.modalStyle}>
// 				<View style={styles.modalView}>
// 					<Searchbar placeholder='Search breed' onChangeText={setBreedSearch} value={breedSearch} style={{ marginBottom: 10 }} />
// 					<ScrollView>
// 						{filteredBreeds.map((breedOption) => (
// 							<List.Item
// 								key={breedOption}
// 								title={breedOption}
// 								onPress={() => {
// 									setBreed(breedOption);
// 									setBreedModalVisible(false);
// 									setBreedSearch('');
// 								}}
// 								left={(props) => (breed === breedOption ? <List.Icon {...props} icon='check' /> : null)}
// 							/>
// 						))}
// 					</ScrollView>
// 				</View>
// 			</Modal>
// 		</ScrollView>
// 	);
// };

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 20,
// 		backgroundColor: '#f5f5f5',
// 	},
// 	title: {
// 		fontSize: 24,
// 		marginBottom: 20,
// 		textAlign: 'center',
// 		color: '#2e7d32',
// 	},
// 	label: {
// 		fontSize: 16,
// 		color: '#666',
// 		marginBottom: 8,
// 		marginTop: 8,
// 	},
// 	input: {
// 		marginBottom: 12,
// 		backgroundColor: 'white',
// 	},
// 	button: {
// 		marginTop: 10,
// 		backgroundColor: '#2e7d32',
// 	},
// 	cancelButton: {
// 		marginTop: 10,
// 		borderColor: '#2e7d32',
// 	},
// 	segmentedButton: {
// 		marginBottom: 12,
// 	},
// 	segment: {
// 		borderColor: '#2e7d32',
// 	},
// 	selectedSegment: {
// 		backgroundColor: '#2e7d32',
// 		borderColor: '#2e7d32',
// 	},
// 	modalStyle: {
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 	},
// 	modalView: {
// 		backgroundColor: 'white',
// 		padding: 20,
// 		margin: 20,
// 		borderRadius: 8,
// 		width: '90%',
// 		maxHeight: '80%',
// 	},
// });

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import { AddPetScreenProps } from '../types/navigation';
import { PetService } from '../services/PetService';
import { useAuth } from '../contexts/AuthContext';
import { petTypes } from '../types';

type PetType = keyof typeof petTypes;

export const AddPet: React.FC<AddPetScreenProps> = ({ navigation }) => {
	const { user } = useAuth();
	const [name, setName] = useState('');
	const [petType, setPetType] = useState<PetType | ''>('');
	const [breed, setBreed] = useState('');
	const [gender, setGender] = useState('');
	const [age, setAge] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

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
		try {
			setLoading(true);
			setError('');

			if (!name || !petType || !breed || !gender || !age) {
				setError('Please fill in all fields');
				return;
			}

			const ageNumber = parseInt(age);
			if (isNaN(ageNumber) || ageNumber < 0) {
				setError('Please enter a valid age');
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

			await PetService.createPet(petData);
			navigation.navigate('Home');
		} catch (err) {
			console.error('Error creating pet:', err);
			setError('Error creating pet. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.title}>Add New Pet</Text>

			<TextInput label="Pet Name" value={name} onChangeText={setName} mode="outlined" style={styles.input} />

			<Text style={styles.label}>Pet Type</Text>
			<SelectList
				setSelected={(val: string) => {
					setPetType(val as PetType);
					setBreed(''); // Limpa a raça quando muda o tipo
				}}
				data={petTypeData}
				save="key"
				placeholder="Select pet type"
				boxStyles={styles.selectBox}
				dropdownStyles={styles.dropdown}
				search={false}
			/>

			<Text style={styles.label}>Breed</Text>
			{petType === 'Other' ? (
				<TextInput label="Breed" value={breed} onChangeText={setBreed} mode="outlined" style={styles.input} />
			) : (
				<SelectList setSelected={setBreed} data={getBreedData()} save="key" placeholder="Select breed" boxStyles={styles.selectBox} dropdownStyles={styles.dropdown} search={true} searchPlaceholder="Search breed" disabled={!petType} />
			)}

			<Text style={styles.label}>Gender</Text>
			<SelectList setSelected={setGender} data={genderData} save="key" placeholder="Select gender" boxStyles={styles.selectBox} dropdownStyles={styles.dropdown} search={false} />

			<TextInput label="Age" value={age} onChangeText={setAge} keyboardType="numeric" mode="outlined" style={styles.input} />

			{error ? (
				<HelperText type="error" visible={!!error}>
					{error}
				</HelperText>
			) : null}

			<Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.button}>
				Add Pet
			</Button>

			<Button mode="outlined" onPress={() => navigation.goBack()} disabled={loading} style={styles.cancelButton}>
				Cancel
			</Button>
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
		marginBottom: 12,
		backgroundColor: 'white',
	},
	selectBox: {
		borderColor: '#2e7d32',
		marginBottom: 12,
		backgroundColor: 'white',
	},
	dropdown: {
		borderColor: '#2e7d32',
		backgroundColor: 'white',
	},
	button: {
		marginTop: 10,
		backgroundColor: '#2e7d32',
	},
	cancelButton: {
		marginTop: 10,
		borderColor: '#2e7d32',
	},
});
