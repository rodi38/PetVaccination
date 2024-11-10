import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, Card, List, Dialog, Portal } from 'react-native-paper';
import { AddVaccinationScreenProps } from '../types/navigation';
import { useRequest } from '../hooks/useRequest';
import { VaccineService } from '../services/VaccineService';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { Vaccine } from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';

export const AddVaccination: React.FC<AddVaccinationScreenProps> = ({ route, navigation }) => {
	const { petId } = route.params;
	const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
	const [vaccines, setVaccines] = useState<Vaccine[]>([]);
	const [notes, setNotes] = useState('');
	const [veterinarian, setVeterinarian] = useState('');
	const [clinic, setClinic] = useState('');
	const [vaccinationDate, setVaccinationDate] = useState(new Date());
	const [nextDoseDate, setNextDoseDate] = useState<Date | null>(null);
	const [showVaccineDialog, setShowVaccineDialog] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showNextDosePicker, setShowNextDosePicker] = useState(false);

	const { execute, isLoading, errors, generalError, setGeneralError } = useRequest();

	useEffect(() => {
		loadVaccines();
	}, []);

	const loadVaccines = async () => {
		const result = await execute(async () => {
			const availableVaccines = await VaccineService.getAllVaccines();
			setVaccines(availableVaccines);
			return availableVaccines;
		});

		if (!result || result.length === 0) {
			// Pode adicionar uma mensagem caso não encontre vacinas disponíveis
			setGeneralError('No vaccines available');
		}
	};

	const handleSubmit = async () => {
		if (!selectedVaccine) {
			return;
		}

		const vaccineData = {
			petId,
			vaccineId: selectedVaccine._id,
			vaccinationDate,
			notes: notes.trim() || undefined, // Se vazio, envia undefined
			veterinarian: veterinarian.trim() || undefined, // Se vazio, envia undefined
			clinic: clinic.trim() || undefined, // Se vazio, envia undefined
		};

		const result = await execute(() => VaccineService.createPetVaccine(vaccineData), {
			showFullScreenLoading: true,
			loadingText: 'Saving vaccination...',
		});

		if (result) {
			navigation.goBack();
		}
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<ScrollView style={styles.container}>
			<LoadingOverlay visible={isLoading} text='Saving vaccination...' />

			<Card style={styles.card}>
				<Card.Content>
					<List.Item title='Select Vaccine' description={selectedVaccine ? selectedVaccine.name : 'Choose a vaccine'} left={(props) => <List.Icon {...props} icon='needle' />} onPress={() => setShowVaccineDialog(true)} style={[styles.listItem, errors.vaccineId && styles.errorItem]} />
					{errors.vaccineId && (
						<HelperText type='error' visible={true}>
							{errors.vaccineId}
						</HelperText>
					)}

					<TextInput label='Veterinarian' value={veterinarian} onChangeText={setVeterinarian} mode='outlined' style={styles.input} error={!!errors.veterinarian} />
					{errors.veterinarian && (
						<HelperText type='error' visible={true}>
							{errors.veterinarian}
						</HelperText>
					)}

					<TextInput label='Clinic' value={clinic} onChangeText={setClinic} mode='outlined' style={styles.input} error={!!errors.clinic} />
					{errors.clinic && (
						<HelperText type='error' visible={true}>
							{errors.clinic}
						</HelperText>
					)}

					<List.Item title='Vaccination Date' description={formatDate(vaccinationDate)} left={(props) => <List.Icon {...props} icon='calendar' />} onPress={() => setShowDatePicker(true)} style={[styles.listItem, errors.vaccinationDate && styles.errorItem]} />
					{errors.vaccinationDate && (
						<HelperText type='error' visible={true}>
							{errors.vaccinationDate}
						</HelperText>
					)}

					<List.Item
						title='Next Dose Date (Optional)'
						description={nextDoseDate ? formatDate(nextDoseDate) : 'Set next dose date'}
						left={(props) => <List.Icon {...props} icon='calendar-clock' />}
						onPress={() => setShowNextDosePicker(true)}
						style={[styles.listItem, errors.nextDoseDate && styles.errorItem]}
					/>
					{errors.nextDoseDate && (
						<HelperText type='error' visible={true}>
							{errors.nextDoseDate}
						</HelperText>
					)}

					<TextInput label='Notes' value={notes} onChangeText={setNotes} mode='outlined' multiline numberOfLines={4} style={styles.input} error={!!errors.notes} />
					{errors.notes && (
						<HelperText type='error' visible={true}>
							{errors.notes}
						</HelperText>
					)}

					{generalError && (
						<HelperText type='error' visible={true} style={styles.generalError}>
							{generalError}
						</HelperText>
					)}
				</Card.Content>
			</Card>

			<Button mode='contained' onPress={handleSubmit} style={styles.submitButton} disabled={!selectedVaccine || isLoading}>
				Save Vaccination
			</Button>

			{/* Vaccine Selection Dialog */}
			<Portal>
				<Dialog visible={showVaccineDialog} onDismiss={() => setShowVaccineDialog(false)}>
					<Dialog.Title>Select Vaccine</Dialog.Title>
					<Dialog.Content>
						{vaccines.map((vaccine) => (
							<List.Item
								key={vaccine._id}
								title={vaccine.name}
								description={vaccine.description}
								onPress={() => {
									setSelectedVaccine(vaccine);
									setShowVaccineDialog(false);
								}}
							/>
						))}
					</Dialog.Content>
				</Dialog>
			</Portal>

			{/* Date Pickers */}
			{showDatePicker && (
				<DateTimePicker
					value={vaccinationDate}
					mode='date'
					display='default'
					onChange={(event, date) => {
						setShowDatePicker(false);
						if (date) {
							setVaccinationDate(date);
						}
					}}
				/>
			)}

			{showNextDosePicker && (
				<DateTimePicker
					value={nextDoseDate || new Date()}
					mode='date'
					display='default'
					onChange={(event, date) => {
						setShowNextDosePicker(false);
						if (date) {
							setNextDoseDate(date);
						}
					}}
				/>
			)}
		</ScrollView>
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
	input: {
		marginBottom: 4,
	},
	listItem: {
		paddingVertical: 8,
		marginBottom: 4,
	},
	errorItem: {
		borderColor: '#ff0000',
		borderWidth: 1,
		borderRadius: 4,
	},
	submitButton: {
		marginBottom: 32,
		backgroundColor: '#2e7d32',
	},
	generalError: {
		textAlign: 'center',
		marginTop: 8,
	},
});
