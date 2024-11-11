import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, List, Divider, Portal, Modal, TextInput, IconButton, HelperText, Dialog } from 'react-native-paper';
import { Pet, PetVaccineResponse } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { PetService } from '../services/PetService';
import { VaccineService } from '../services/VaccineService';
import { useRequest } from '../hooks/useRequest';
import { LoadingOverlay } from '../components/LoadingOverlay';

type Props = NativeStackScreenProps<RootStackParamList, 'PetDetails'>;

export const PetDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
	const { petId } = route.params;
	const [pet, setPet] = useState<Pet | null>(null);
	const [vaccineData, setVaccineData] = useState<PetVaccineResponse | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [editName, setEditName] = useState('');
	const [editAge, setEditAge] = useState('');
	const { execute, isLoading, errors } = useRequest();

	const [deleteVaccineModalVisible, setDeleteVaccineModalVisible] = useState(false);
	const [selectedVaccineId, setSelectedVaccineId] = useState<string>('');

	const truncateText = (text: string, maxLength: number) => {
		return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
	};

	const fetchPetDetails = async () => {
		try {
			// Fetch pet details
			const petResponse = await PetService.getPetById(petId);
			setPet(petResponse);

			// Fetch pet vaccinations
			const petVaccinations = await VaccineService.getPetVaccines(petId);

			setVaccineData(petVaccinations as PetVaccineResponse);
		} catch (error) {
			console.error('Error fetching pet details:', error);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchPetDetails();
		setRefreshing(false);
	};

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			fetchPetDetails();
		});

		return unsubscribe;
	}, [navigation]);

	const handleEdit = async () => {
		if (!pet) {
			return;
		}

		const ageNumber = parseInt(editAge);
		if (isNaN(ageNumber) || ageNumber < 0) {
			return;
		}

		const result = await execute(
			() =>
				PetService.updatePet(petId, {
					name: editName,
					age: ageNumber,
					// mantemos os outros campos inalterados
					petType: pet.petType,
					breed: pet.breed,
					gender: pet.gender,
					owner: pet.owner,
				}),
			{
				showFullScreenLoading: true,
				loadingText: 'Updating pet...',
			},
		);

		if (result) {
			setPet({ ...pet, name: editName, age: ageNumber });
			setEditModalVisible(false);
			fetchPetDetails(); // Atualiza os dados
		}
	};

	const handleDelete = async () => {
		const result = await execute(() => PetService.deletePet(petId), {
			showFullScreenLoading: true,
			loadingText: 'Deleting pet...',
		});

		if (result !== null) {
			navigation.goBack();
		}
	};
	const openEditModal = () => {
		if (pet) {
			setEditName(pet.name);
			setEditAge(pet.age.toString());
			setEditModalVisible(true);
		}
	};

	useEffect(() => {
		fetchPetDetails();
	}, [petId]);

	if (!pet) {
		return null;
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
	};

	const handleDeleteVaccine = async () => {
		const result = await execute(() => VaccineService.deletePetVaccine(selectedVaccineId, petId), {
			showFullScreenLoading: true,
			loadingText: 'Deleting vaccination...',
		});

		if (result !== null) {
			setDeleteVaccineModalVisible(false);
			fetchPetDetails(); // Atualiza a lista
		}
	};

	return (
		<>
			<ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				<LoadingOverlay visible={isLoading} text='Updating pet...' />

				<Card style={styles.infoCard}>
					<Card.Content>
						<View style={styles.headerContainer}>
							<Title style={styles.petName}>{pet?.name}</Title>
							<View style={styles.headerButtons}>
								<IconButton icon='pencil' size={20} onPress={openEditModal} iconColor='#2e7d32' style={styles.headerButton} />
								<IconButton icon='delete' size={20} onPress={() => setDeleteModalVisible(true)} iconColor='#d32f2f' style={styles.headerButton} />
							</View>
						</View>
						<Paragraph style={styles.petInfo}>Tipo: {pet?.petType}</Paragraph>
						<Paragraph style={styles.petInfo}>Raça: {pet?.breed}</Paragraph>
						<Paragraph style={styles.petInfo}>Sexo: {pet?.gender}</Paragraph>
						<Paragraph style={styles.petInfo}>
							Idade: {pet?.age} {pet?.age === 1 ? 'ano' : 'anos'}
						</Paragraph>
					</Card.Content>
				</Card>

				<Card style={styles.vaccinationsCard}>
					<Card.Content>
						<View style={styles.vaccinationHeader}>
							<View style={styles.titleContainer}>
								<Title style={styles.sectionTitle}>Vacinas</Title>
								<Title style={styles.vaccineCount}>Total: {vaccineData?.totalVaccinations || 0}</Title>
							</View>
						</View>

						{vaccineData?.vaccinations.map((vaccination, index) => (
							<React.Fragment key={vaccination.vaccine._id}>
								<List.Item
									title={() => (
										<View style={styles.vaccinationRow}>
											<Paragraph style={styles.vaccineName}>{truncateText(vaccination.vaccine.name, 10)}</Paragraph>
											<View style={styles.rightContent}>
												<Paragraph style={styles.vaccineDate}>{formatDate(vaccination.vaccinationDate)}</Paragraph>
												<IconButton
													icon='delete'
													size={18}
													iconColor='#d32f2f'
													style={styles.deleteIcon}
													onPress={() => {
														setSelectedVaccineId(vaccination.vaccine._id);
														setDeleteVaccineModalVisible(true);
													}}
												/>
											</View>
										</View>
									)}
									left={(props) => <List.Icon {...props} icon='needle' color='#2e7d32' />}
									onPress={() =>
										navigation.navigate('VaccinationDetails', {
											petId,
											vaccinationId: vaccination.vaccine._id,
										})
									}
									style={styles.vaccinationItem}
								/>
								{index < vaccineData.vaccinations.length - 1 && <Divider />}
							</React.Fragment>
						))}

						{!vaccineData?.vaccinations.length && <Paragraph style={styles.noVaccines}>No vaccinations recorded</Paragraph>}
					</Card.Content>
				</Card>

				<Button mode='contained' style={styles.addButton} onPress={() => navigation.navigate('AddVaccination', { petId })}>
					Add Vaccination
				</Button>

				<Dialog visible={deleteVaccineModalVisible} onDismiss={() => setDeleteVaccineModalVisible(false)}>
					<Dialog.Title>Delete Vaccination</Dialog.Title>
					<Dialog.Content>
						<Paragraph>Are you sure you want to delete this vaccination?</Paragraph>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setDeleteVaccineModalVisible(false)}>Cancel</Button>
						<Button onPress={handleDeleteVaccine} textColor='#d32f2f'>
							Delete
						</Button>
					</Dialog.Actions>
				</Dialog>
			</ScrollView>
			<Portal>
				<Modal visible={editModalVisible} onDismiss={() => setEditModalVisible(false)} contentContainerStyle={styles.modalContainer}>
					<Title style={styles.modalTitle}>Edit Pet</Title>
					<TextInput label='Pet Name' value={editName} onChangeText={setEditName} mode='outlined' style={styles.modalInput} error={!!errors.name} />
					{errors.name && (
						<HelperText type='error' visible={true}>
							{errors.name}
						</HelperText>
					)}
					<TextInput label='Age' value={editAge} onChangeText={setEditAge} keyboardType='numeric' mode='outlined' style={styles.modalInput} error={!!errors.age} />
					{errors.age && (
						<HelperText type='error' visible={true}>
							{errors.age}
						</HelperText>
					)}
					<View style={styles.modalButtons}>
						<Button mode='outlined' onPress={() => setEditModalVisible(false)} style={styles.modalButton}>
							Cancel
						</Button>
						<Button mode='contained' onPress={handleEdit} style={styles.modalButton}>
							Save
						</Button>
					</View>
				</Modal>

				<Dialog visible={deleteModalVisible} onDismiss={() => setDeleteModalVisible(false)}>
					<Dialog.Title>Delete Pet</Dialog.Title>
					<Dialog.Content>
						<Paragraph>Are you sure you want to delete {pet?.name}? This action cannot be undone.</Paragraph>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setDeleteModalVisible(false)}>Cancel</Button>
						<Button onPress={handleDelete} textColor='#d32f2f'>
							Delete
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		padding: 16,
	},
	infoCard: {
		marginBottom: 16,
		elevation: 4,
		backgroundColor: 'white',
	},
	vaccinationsCard: {
		marginBottom: 16,
		elevation: 4,
		backgroundColor: 'white',
	},

	petInfo: {
		color: '#666',
		fontSize: 16,
		marginBottom: 4,
	},
	sectionTitle: {
		color: '#2e7d32',
		fontSize: 20,
		marginBottom: 0, // Removido o marginBottom para alinhar com o número
	},
	noVaccines: {
		color: '#666',
		fontStyle: 'italic',
		textAlign: 'center',
		marginTop: 16,
	},
	addButton: {
		marginTop: 16,
		marginBottom: 32,
		backgroundColor: '#2e7d32',
	},
	vaccinationHeader: {
		marginBottom: 16,
	},
	vaccineCount: {
		color: '#666',
		fontSize: 20, // Aumentado para combinar com o título
	},
	vaccinationItem: {
		paddingVertical: 8,
	},
	titleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	modalContainer: {
		backgroundColor: 'white',
		padding: 20,
		margin: 20,
		borderRadius: 8,
	},
	modalTitle: {
		fontSize: 24,
		color: '#2e7d32',
		marginBottom: 16,
		textAlign: 'center',
	},
	modalInput: {
		marginBottom: 12,
		backgroundColor: 'white',
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 8,
		marginTop: 8,
	},
	modalButton: {
		flex: 1,
	},

	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerButtons: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	headerButton: {
		margin: 0, // Remove margens padrão do IconButton
		padding: 0, // Ajusta o padding se necessário
	},
	petName: {
		color: '#2e7d32',
		fontSize: 24,
		marginBottom: 0, // Removido o marginBottom que causava o desalinhamento
		flex: 1, // Permite que o título ocupe o espaço disponível
	},

	vaccinationRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flex: 1,
		paddingRight: 0, // Removido o padding para acomodar o ícone
	},
	rightContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	vaccineName: {
		fontSize: 16,
		color: '#333',
		flex: 1, // Permite que o nome ocupe o espaço disponível
	},
	vaccineDate: {
		fontSize: 14,
		color: '#666',
		marginRight: 4,
	},
	deleteIcon: {
		margin: 0,
		padding: 0,
	},
});
