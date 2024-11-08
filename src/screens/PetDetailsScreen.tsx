import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, List, Divider } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { Pet, PetVaccine, Vaccine } from '../types';

import { RouteProp } from '@react-navigation/native';
import { NavigationProp, RootStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// type PetDetailsProps = {
//   navigation: NavigationProp;
//   route: RouteProp<RootStackParamList, "PetDetails">;
// };
type Props = NativeStackScreenProps<RootStackParamList, 'PetDetails'>;

interface PetVaccineWithDetails extends PetVaccine {
	vaccineDetails?: Vaccine;
}

export const PetDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
	const { petId } = route.params;
	const [pet, setPet] = useState<Pet | null>(null);
	const [vaccinations, setVaccinations] = useState<PetVaccineWithDetails[]>([]);
	const [refreshing, setRefreshing] = useState(false);

	const fetchPetDetails = async () => {
		try {
			const [petResponse, vaccinationsResponse] = await Promise.all([api.get(`/pets/${petId}`), api.get(`/vaccines/pet/${petId}`)]);

			setPet(petResponse.data);

			// Fetch vaccine details for each vaccination
			const vaccinationsWithDetails = await Promise.all(
				vaccinationsResponse.data.map(async (vaccination: PetVaccine) => {
					const vaccineResponse = await api.get(`/vaccines/${vaccination.vaccineId}`);
					return {
						...vaccination,
						vaccineDetails: vaccineResponse.data,
					};
				}),
			);

			setVaccinations(vaccinationsWithDetails);
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
		fetchPetDetails();
	}, [petId]);

	if (!pet) {
		return null;
	}

	return (
		<ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
			<Card style={styles.infoCard}>
				<Card.Content>
					<Title style={styles.petName}>{pet.name}</Title>
					<Paragraph style={styles.petInfo}>Type: {pet.petType}</Paragraph>
					<Paragraph style={styles.petInfo}>Breed: {pet.breed}</Paragraph>
					<Paragraph style={styles.petInfo}>Gender: {pet.gender}</Paragraph>
					<Paragraph style={styles.petInfo}>
						Age: {pet.age} {pet.age === 1 ? 'year' : 'years'}
					</Paragraph>
				</Card.Content>
			</Card>

			<Card style={styles.vaccinationsCard}>
				<Card.Content>
					<Title style={styles.sectionTitle}>Vaccinations</Title>
					{vaccinations.map((vaccination, index) => (
						<React.Fragment key={vaccination._id}>
							<List.Item title={vaccination.vaccineDetails?.name || 'Unknown Vaccine'} description={`Date: ${new Date(vaccination.vaccinationDate).toLocaleDateString()}\n${vaccination.notes || ''}`} left={(props) => <List.Icon {...props} icon='needle' />} />
							{index < vaccinations.length - 1 && <Divider />}
						</React.Fragment>
					))}
					{vaccinations.length === 0 && <Paragraph style={styles.noVaccines}>No vaccinations recorded</Paragraph>}
				</Card.Content>
			</Card>

			<Button mode='contained' style={styles.addButton} onPress={() => navigation.navigate('AddVaccination', { petId })}>
				Add Vaccination
			</Button>
		</ScrollView>
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
	petName: {
		color: '#2e7d32',
		fontSize: 24,
		marginBottom: 8,
	},
	petInfo: {
		color: '#666',
		fontSize: 16,
		marginBottom: 4,
	},
	sectionTitle: {
		color: '#2e7d32',
		fontSize: 20,
		marginBottom: 16,
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
});
