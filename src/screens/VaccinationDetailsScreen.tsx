import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, List, Divider, IconButton, Portal, Modal, TextInput, Button, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { VaccinationDetailsScreenProps } from '../types/navigation';
import { VaccineService } from '../services/VaccineService';
import { VaccinationDetailsResponse } from '../types';
import { useRequest } from '../hooks/useRequest';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const VaccinationDetailsScreen: React.FC<VaccinationDetailsScreenProps> = ({ route }) => {
	const { vaccinationId, petId } = route.params;
	const [vaccination, setVaccination] = useState<VaccinationDetailsResponse | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [editVeterinarian, setEditVeterinarian] = useState('');
	const [editClinic, setEditClinic] = useState('');
	const [editNotes, setEditNotes] = useState('');
	const [editVaccinationDate, setEditVaccinationDate] = useState<Date | null>(null);
	const [editNextDoseDate, setEditNextDoseDate] = useState<Date | null>(null);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showNextDosePicker, setShowNextDosePicker] = useState(false);
	const { execute, isLoading, errors } = useRequest();

	const fetchVaccinationDetails = useCallback(async () => {
		try {
			const data = await VaccineService.getPetVaccineDetails(petId, vaccinationId);
			setVaccination(data);
		} catch (error) {
			console.error('Error fetching vaccination details:', error);
		}
	}, [petId, vaccinationId]);

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchVaccinationDetails();
		setRefreshing(false);
	};

	useEffect(() => {
		fetchVaccinationDetails();
	}, [fetchVaccinationDetails]);

	const formatDate = (date: Date | string) => {
		if (!date) {
			return '';
		}
		const dateObj = date instanceof Date ? date : new Date(date);
		if (isNaN(dateObj.getTime())) {
			return 'Data inválida';
		}

		return dateObj.toLocaleDateString('pt-BR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const openEditModal = () => {
		if (!vaccination) {
			return;
		}
		setEditVeterinarian(vaccination.petVaccine.veterinarian || '');
		setEditClinic(vaccination.petVaccine.clinic || '');
		setEditNotes(vaccination.petVaccine.notes || '');
		setEditVaccinationDate(new Date(vaccination.petVaccine.vaccinationDate));
		setEditNextDoseDate(vaccination.petVaccine.nextDoseDate ? new Date(vaccination.petVaccine.nextDoseDate) : null);
		setEditModalVisible(true);
	};

	const handleEdit = async () => {
		if (!editVaccinationDate) {
			return;
		}

		const result = await execute(
			() =>
				VaccineService.updatePetVaccine(petId, vaccinationId, {
					vaccinationDate: editVaccinationDate.toISOString(),
					nextDoseDate: editNextDoseDate ? editNextDoseDate.toISOString() : undefined,
					veterinarian: editVeterinarian.trim() || undefined,
					clinic: editClinic.trim() || undefined,
					notes: editNotes.trim() || undefined,
				}),
			{
				showFullScreenLoading: true,
				loadingText: 'Updating vaccination...',
				successMessage: 'Vacinação atualizada com sucesso!',
			},
		);

		if (result) {
			setEditModalVisible(false);
			fetchVaccinationDetails();
		}
	};

	if (!vaccination) {
		return null;
	}

	return (
		<>
			<ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				<LoadingOverlay visible={isLoading} text="Updating vaccination..." />

				<Card style={styles.card}>
					<Card.Content>
						<View style={styles.headerContainer}>
							<Title style={styles.vaccineTitle}>{vaccination.vaccine.name}</Title>
							<IconButton icon="pencil" size={20} onPress={openEditModal} iconColor="#2e7d32" />
						</View>

						<Divider style={styles.divider} />

						<List.Item title="Data da Vacinação" description={formatDate(vaccination.petVaccine.vaccinationDate)} left={(props) => <List.Icon {...props} icon="calendar" />} />

						{vaccination.petVaccine.nextDoseDate && <List.Item title="Próxima Dose" description={formatDate(vaccination.petVaccine.nextDoseDate)} left={(props) => <List.Icon {...props} icon="calendar-clock" />} />}

						{vaccination.petVaccine.veterinarian && <List.Item title="Veterinário" description={vaccination.petVaccine.veterinarian} left={(props) => <List.Icon {...props} icon="doctor" />} />}

						{vaccination.petVaccine.clinic && <List.Item title="Clínica" description={vaccination.petVaccine.clinic} left={(props) => <List.Icon {...props} icon="hospital-building" />} />}

						{vaccination.petVaccine.notes && (
							<View style={styles.notesContainer}>
								<Title style={styles.notesTitle}>Observações</Title>
								<Paragraph style={styles.notes}>{vaccination.petVaccine.notes}</Paragraph>
							</View>
						)}
					</Card.Content>
				</Card>
			</ScrollView>

			<Portal>
				<Modal visible={editModalVisible} onDismiss={() => setEditModalVisible(false)} contentContainerStyle={styles.modalContainer}>
					<Title style={styles.modalTitle}>Editar Vacinação</Title>

					<List.Item title="Data da Vacinação" description={editVaccinationDate ? formatDate(editVaccinationDate) : ''} left={(props) => <List.Icon {...props} icon="calendar" />} onPress={() => setShowDatePicker(true)} style={styles.modalListItem} />
					{errors.vaccinationDate && (
						<HelperText type="error" visible={true}>
							{errors.vaccinationDate}
						</HelperText>
					)}

					<List.Item title="Próxima Dose (Opcional)" description={editNextDoseDate ? formatDate(editNextDoseDate) : 'Não definida'} left={(props) => <List.Icon {...props} icon="calendar-clock" />} onPress={() => setShowNextDosePicker(true)} style={styles.modalListItem} />

					<TextInput label="Veterinário" value={editVeterinarian} onChangeText={setEditVeterinarian} mode="outlined" style={styles.modalInput} error={!!errors.veterinarian} />
					{errors.veterinarian && (
						<HelperText type="error" visible={true}>
							{errors.veterinarian}
						</HelperText>
					)}

					<TextInput label="Clínica" value={editClinic} onChangeText={setEditClinic} mode="outlined" style={styles.modalInput} error={!!errors.clinic} />
					{errors.clinic && (
						<HelperText type="error" visible={true}>
							{errors.clinic}
						</HelperText>
					)}

					<TextInput label="Observação" value={editNotes} onChangeText={setEditNotes} mode="outlined" multiline numberOfLines={3} style={styles.modalInput} error={!!errors.notes} />
					{errors.notes && (
						<HelperText type="error" visible={true}>
							{errors.notes}
						</HelperText>
					)}

					<View style={styles.modalButtons}>
						<Button mode="outlined" onPress={() => setEditModalVisible(false)} style={styles.modalButton}>
							Cancelar
						</Button>
						<Button mode="contained" onPress={handleEdit} style={styles.modalButton}>
							Salvar
						</Button>
					</View>
				</Modal>
			</Portal>

			{showDatePicker && (
				<DateTimePicker
					value={editVaccinationDate || new Date()}
					mode="date"
					display="default"
					maximumDate={new Date()}
					onChange={(event, date) => {
						setShowDatePicker(false);
						if (date) {
							setEditVaccinationDate(date);
						}
					}}
				/>
			)}

			{showNextDosePicker && (
				<DateTimePicker
					value={editNextDoseDate || new Date()}
					mode="date"
					display="default"
					onChange={(event, date) => {
						setShowNextDosePicker(false);
						if (date) {
							setEditNextDoseDate(date);
						}
					}}
				/>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		padding: 16,
	},
	card: {
		marginBottom: 16,
		elevation: 4,
		backgroundColor: 'white',
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	vaccineTitle: {
		color: '#2e7d32',
		fontSize: 24,
		marginBottom: 8,
		flex: 1,
	},
	description: {
		color: '#666',
		fontSize: 16,
		marginBottom: 16,
	},
	divider: {
		marginVertical: 16,
	},
	notesContainer: {
		marginTop: 16,
	},
	notesTitle: {
		color: '#2e7d32',
		fontSize: 18,
		marginBottom: 8,
	},
	notes: {
		color: '#666',
		fontSize: 16,
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
	modalListItem: {
		borderWidth: 1,
		borderColor: '#2e7d32',
		borderRadius: 4,
		marginBottom: 12,
		backgroundColor: 'white',
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
});
