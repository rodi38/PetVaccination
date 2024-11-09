import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, FAB, Portal, ActivityIndicator } from 'react-native-paper';
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
	const [fabOpen, setFabOpen] = useState(false);
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
				console.log('user id', user?._id);

				console.log(petsResponse);

				if (petsResponse) {
					const petsWithVaccines = await Promise.all(
						petsResponse.map(async (pet) => {
							const vaccineCount = await VaccineService.getPetVaccineCount(pet._id);
							return {
								...pet,
								vaccineCount,
							};
						}),
					);

					setPets(petsWithVaccines);
				} else {
					console.log('No pets found');
					setPets([]); // or setPets(null), depending on your desired behavior
				}
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
			<Portal>
				<FAB.Group
					open={fabOpen}
					visible
					icon={fabOpen ? 'close' : 'plus'}
					actions={[
						{
							icon: 'needle',
							label: 'Add Vaccine Type',
							onPress: () => navigation.navigate('AddVaccineType'),
							labelStyle: styles.fabActionLabel,
							style: styles.fabAction,
						},
						{
							icon: 'paw',
							label: 'Add Pet',
							onPress: () => navigation.navigate('AddPet'),
							labelStyle: styles.fabActionLabel,
							style: styles.fabAction,
						},
					]}
					onStateChange={({ open }) => setFabOpen(open)}
					onPress={() => {
						if (fabOpen) {
							// Já está aberto, não precisa fazer nada
						}
					}}
					fabStyle={styles.fab}
					style={styles.fabGroup}
				/>
			</Portal>
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
	fabGroup: {
		paddingHorizontal: 0,
		position: 'absolute',
		left: 0,
		bottom: 0,
	},
	fab: {
		backgroundColor: '#2e7d32',
		borderRadius: 50,
	},
	fabAction: {
		backgroundColor: '#81c784',
	},
	fabActionLabel: {
		backgroundColor: 'white',
	},
});
