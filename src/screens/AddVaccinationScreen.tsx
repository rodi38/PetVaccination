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

	const { execute, isLoading, error } = useRequest();

	useEffect(() => {
		loadVaccines();
	}, []);

	const loadVaccines = async () => {
		try {
			const availableVaccines = await VaccineService.getAllVaccines();
			setVaccines(availableVaccines);
		} catch (error) {
			console.error('Error loading vaccines:', error);
		}
	};

	const handleSubmit = async () => {
		if (!selectedVaccine) {
			return;
		}

		await execute(
			async () => {
				const vaccineData = {
					petId,
					vaccineId: selectedVaccine._id,
					vaccinationDate,
					notes,
					veterinarian,
					clinic,
					nextDoseDate,
				};

				console.log(vaccineData);

				await VaccineService.createPetVaccine(vaccineData);
				navigation.goBack();
			},
			{
				showFullScreenLoading: true,
				loadingText: 'Saving vaccination...',
			},
		);
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
					<List.Item title='Select Vaccine' description={selectedVaccine ? selectedVaccine.name : 'Choose a vaccine'} left={(props) => <List.Icon {...props} icon='needle' />} onPress={() => setShowVaccineDialog(true)} style={styles.listItem} />

					<TextInput label='Veterinarian' value={veterinarian} onChangeText={setVeterinarian} mode='outlined' style={styles.input} />

					<TextInput label='Clinic' value={clinic} onChangeText={setClinic} mode='outlined' style={styles.input} />

					<List.Item title='Vaccination Date' description={formatDate(vaccinationDate)} left={(props) => <List.Icon {...props} icon='calendar' />} onPress={() => setShowDatePicker(true)} style={styles.listItem} />

					<List.Item title='Next Dose Date (Optional)' description={nextDoseDate ? formatDate(nextDoseDate) : 'Set next dose date'} left={(props) => <List.Icon {...props} icon='calendar-clock' />} onPress={() => setShowNextDosePicker(true)} style={styles.listItem} />

					<TextInput label='Notes' value={notes} onChangeText={setNotes} mode='outlined' multiline numberOfLines={4} style={styles.input} />

					{error && (
						<HelperText type='error' visible={true}>
							{error}
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
		marginBottom: 16,
	},
	listItem: {
		paddingVertical: 8,
		marginBottom: 16,
	},
	submitButton: {
		marginBottom: 32,
		backgroundColor: '#2e7d32',
	},
});
