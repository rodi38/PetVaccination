import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, List, Divider, IconButton } from 'react-native-paper';
import { VaccinationDetailsScreenProps } from '../types/navigation';
import { VaccineService } from '../services/VaccineService';
import { VaccinationDetailsResponse } from '../types';

export const VaccinationDetailsScreen: React.FC<VaccinationDetailsScreenProps> = ({ route, navigation }) => {
	const { vaccinationId, petId } = route.params;
	const [vaccination, setVaccination] = useState<VaccinationDetailsResponse | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	const fetchVaccinationDetails = async () => {
		try {
			const data = await VaccineService.getPetVaccineDetails(vaccinationId, petId);
			console.log('Fetched data:', data); // Para debug
			console.log('teste');

			setVaccination(data);
		} catch (error) {
			console.error('Error fetching vaccination details:', error);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchVaccinationDetails();
		setRefreshing(false);
	};

	useEffect(() => {
		fetchVaccinationDetails();
	}, [vaccinationId]);

	if (!vaccination) {
		return null;
	}

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

	return (
		<ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
			<Card style={styles.card}>
				<Card.Content>
					<Title style={styles.vaccineTitle}>{vaccination.vaccine.name}</Title>

					<Divider style={styles.divider} />

					<List.Item title='Data da Vacinação' description={formatDate(vaccination.petVaccine.vaccinationDate)} left={(props) => <List.Icon {...props} icon='calendar' />} />

					{vaccination.petVaccine.nextDoseDate && <List.Item title='Próxima Dose' description={formatDate(vaccination.petVaccine.nextDoseDate)} left={(props) => <List.Icon {...props} icon='calendar-clock' />} />}

					{vaccination.petVaccine.veterinarian && <List.Item title='Veterinário' description={vaccination.petVaccine.veterinarian} left={(props) => <List.Icon {...props} icon='doctor' />} />}

					{vaccination.petVaccine.clinic && <List.Item title='Clínica' description={vaccination.petVaccine.clinic} left={(props) => <List.Icon {...props} icon='hospital-building' />} />}

					{vaccination.petVaccine.notes && (
						<View style={styles.notesContainer}>
							<Title style={styles.notesTitle}>Observações</Title>
							<Paragraph style={styles.notes}>{vaccination.petVaccine.notes}</Paragraph>
						</View>
					)}
				</Card.Content>
			</Card>
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
	vaccineTitle: {
		color: '#2e7d32',
		fontSize: 24,
		marginBottom: 8,
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
});
