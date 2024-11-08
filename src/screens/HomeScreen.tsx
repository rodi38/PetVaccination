import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB, ActivityIndicator } from 'react-native-paper';
import { Pet } from '../types';
import { HomeScreenProps } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useRequest } from '../hooks/useRequest';
import { PetService } from '../services/PetService';
import { VaccineService } from '../services/VaccineService';

interface PetWithVaccineCount extends Pet {
	vaccineCount: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
	const { user } = useAuth();
	const [pets, setPets] = useState<PetWithVaccineCount[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const { execute, isLoading } = useRequest();

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					{isLoading && <ActivityIndicator size='small' color='white' style={{ marginRight: 10 }} />}
					<TouchableOpacity style={styles.avatarButton} onPress={() => navigation.navigate('Profile')}>
						<Title style={styles.avatarText}>{user?.username ? user.username.charAt(0).toUpperCase() : ''}</Title>
					</TouchableOpacity>
				</View>
			),
		});
	}, [navigation, isLoading, user]);

	const fetchPets = async () => {
		await execute(async () => {
			try {
				// Buscar pets
				const petsResponse = await PetService.getAllPetsByOwnerId(user?._id);
				console.log(petsResponse);

				const petcountone = await VaccineService.getPetVaccineCount('6711ce9940179d36ebd02194');
				console.log('teste: ', petcountone);

				// Buscar contagem de vacinas para cada pet
				const petsWithVaccines = await Promise.all(
					petsResponse.map(async (pet) => {
						const vaccineCount = await VaccineService.getPetVaccineCount(pet._id);
						return {
							...pet,
							vaccineCount,
						};
					}),
				);

				// setPets(petsResponse);
				setPets(petsWithVaccines);
			} catch (error) {
				console.error('Error fetching pets:', error);
			}
		});
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchPets();
		setRefreshing(false);
	};

	useEffect(() => {
		fetchPets();
	}, []);

	const renderPetCard = ({ item: pet }: { item: PetWithVaccineCount }) => (
		<Card style={styles.card} onPress={() => navigation.navigate('PetDetails', { petId: pet._id })}>
			<Card.Content>
				<Title style={styles.petName}>{pet.name}</Title>
				<Paragraph style={styles.petInfo}>
					{pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'} old
				</Paragraph>
				<Paragraph style={styles.vaccineCount}>Vaccines: {pet.vaccineCount}</Paragraph>
			</Card.Content>
		</Card>
	);

	return (
		<View style={styles.container}>
			<FlatList data={pets} renderItem={renderPetCard} keyExtractor={(pet) => pet._id} contentContainerStyle={styles.listContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} />
			<FAB style={styles.fab} icon='plus' onPress={() => navigation.navigate('AddPet')} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	listContainer: {
		padding: 16,
	},
	card: {
		marginBottom: 16,
		elevation: 4,
		backgroundColor: 'white',
	},
	petName: {
		color: '#2e7d32',
		fontSize: 20,
	},
	petInfo: {
		color: '#666',
		marginTop: 4,
	},
	vaccineCount: {
		color: '#2e7d32',
		marginTop: 8,
		fontWeight: 'bold',
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
		backgroundColor: '#2e7d32',
	},
	avatarButton: {
		width: 35,
		height: 35,
		borderRadius: 17.5,
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
	},
	avatarText: {
		color: 'white',
		fontSize: 16,
	},
});
