import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, Portal, ActivityIndicator, Searchbar, Button } from 'react-native-paper';
import { Pet } from '../types';
import { HomeScreenProps } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useRequest } from '../hooks/useRequest';
import { PetService } from '../services/PetService';
import { VaccineService } from '../services/VaccineService';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

interface PetWithVaccineCount extends Pet {
	vaccineCount: number;
}

const ITEMS_PER_PAGE = 6;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
	const { user } = useAuth();
	const [pets, setPets] = useState<PetWithVaccineCount[]>([]);
	const [filteredPets, setFilteredPets] = useState<PetWithVaccineCount[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [fabOpen, setFabOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const { execute, isLoading } = useRequest();

	const isFocused = useIsFocused();

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

	const totalPages = Math.ceil(filteredPets.length / ITEMS_PER_PAGE);

	// Handle search
	const onChangeSearch = (query: string) => {
		setSearchQuery(query);
		const filtered = pets.filter((pet) => pet.name.toLowerCase().includes(query.toLowerCase()));
		setFilteredPets(filtered);
		setCurrentPage(1); // Reset to first page when searching
	};

	const getCurrentPagePets = () => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredPets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	};

	const fetchPets = async () => {
		await execute(async () => {
			try {
				// Buscar pets
				const petsResponse = await PetService.getAllPetsByOwnerId(user?._id);

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
					setFilteredPets(petsWithVaccines);
				} else {
					console.log('No pets found');
					setPets([]);
					setFilteredPets([]); // or setPets(null), depending on your desired behavior
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

	useFocusEffect(
		React.useCallback(() => {
			fetchPets();
		}, []),
	);

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
				<Paragraph style={styles.vaccineCount}>Vacinas: {pet.vaccineCount}</Paragraph>
			</Card.Content>
		</Card>
	);

	const renderPagination = () => (
		<View style={styles.paginationContainer}>
			<Button mode='text' onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} style={styles.paginationButton}>
				Anterior
			</Button>
			<Text style={styles.paginationText}>
				Página {currentPage} de {totalPages}
			</Text>
			<Button mode='text' onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} style={styles.paginationButton}>
				Próximo
			</Button>
		</View>
	);

	return (
		<View style={styles.container}>
			<Searchbar placeholder='Pesquisar por pet' onChangeText={onChangeSearch} value={searchQuery} style={styles.searchBar} />
			<FlatList data={getCurrentPagePets()} renderItem={renderPetCard} keyExtractor={(pet) => pet._id} contentContainerStyle={styles.listContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} ListFooterComponent={renderPagination} />
			<Portal>
				<FAB.Group
					open={fabOpen}
					visible={isFocused} // Adicione esta linha
					icon={fabOpen ? 'close' : 'plus'}
					actions={[
						{
							icon: 'needle',
							label: 'Adicionar novo tipo de vacina',
							onPress: () => navigation.navigate('AddVaccineType'),
							labelStyle: styles.fabActionLabel,
							style: styles.fabAction,
						},
						{
							icon: 'paw',
							label: 'Adicionar novo Pet',
							onPress: () => navigation.navigate('AddPet'),
							labelStyle: styles.fabActionLabel,
							style: styles.fabAction,
						},
					]}
					onStateChange={({ open }) => setFabOpen(open)}
					onPress={() => {
						if (fabOpen) {
							// Already open, no action needed
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
	searchBar: {
		margin: 16,
		elevation: 4,
	},
	listContainer: {
		padding: 16,
		paddingBottom: 80, // Extra padding for FAB
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
	paginationContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 16,
	},
	paginationButton: {
		marginHorizontal: 8,
	},
	paginationText: {
		color: '#666',
		fontSize: 14,
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
