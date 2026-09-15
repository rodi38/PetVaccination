import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, Card, List, Dialog, Portal, IconButton, Divider } from 'react-native-paper';
import { AddVaccinationScreenProps } from '../types/navigation';
import { useRequest } from '../hooks/useRequest';
import { VaccineService } from '../services/VaccineService';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { Vaccine } from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';

const ITEMS_PER_PAGE = 5; // Número de itens por página

export const AddVaccination: React.FC<AddVaccinationScreenProps> = ({ route, navigation }) => {
	const { petId } = route.params;
	const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
	const [vaccines, setVaccines] = useState<Vaccine[]>([]);
	const [notes, setNotes] = useState('');
	const [veterinarian, setVeterinarian] = useState('');
	const [clinic, setClinic] = useState('');
	const [doses, setDoses] = useState<Date[]>([new Date()]);
	const [editingDoseIndex, setEditingDoseIndex] = useState<number | null>(null);
	const [showVaccineDialog, setShowVaccineDialog] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [vaccineToDelete, setVaccineToDelete] = useState<Vaccine | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	const { execute, isLoading, errors, generalError, setGeneralError } = useRequest();

	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		return vaccines.slice(startIndex, endIndex);
	};

	const totalPages = Math.ceil(vaccines.length / ITEMS_PER_PAGE);

	const goToNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const goToPrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleCloseDialog = () => {
		setShowVaccineDialog(false);
		setCurrentPage(1);
	};

	const loadVaccines = useCallback(async () => {
		const result = await execute(async () => {
			const availableVaccines = await VaccineService.getAllVaccines();
			setVaccines(availableVaccines.items);
			return availableVaccines.items;
		});

		if (!result || result.length === 0) {
			// Pode adicionar uma mensagem caso não encontre vacinas disponíveis
			setGeneralError('No vaccines available');
		}
	}, [execute, setGeneralError]);

	useEffect(() => {
		loadVaccines();
	}, [loadVaccines]);

	const handleDeleteVaccine = async () => {
		if (!vaccineToDelete) {
			return;
		}

		execute(async () => {
			await VaccineService.deleteVaccine(vaccineToDelete._id);
			// Atualiza a lista de vacinas após deletar
			await loadVaccines();
			// Se a vacina deletada era a selecionada, limpa a seleção
			if (selectedVaccine?._id === vaccineToDelete._id) {
				setSelectedVaccine(null);
			}
		});

		setShowDeleteConfirm(false);
		setVaccineToDelete(null);
	};

	const truncateText = (text: string, maxLength: number = 15) => {
		return text.length > maxLength ? `${text.substring(0, maxLength - 3)}...` : text;
	};

	const handleSubmit = async () => {
		if (!selectedVaccine) {
			return;
		}

		const vaccineData = {
			petId,
			vaccineId: selectedVaccine._id,
			doses: doses.map((date) => date.toISOString()),
			notes: notes.trim() || undefined, // Se vazio, envia undefined
			veterinarian: veterinarian.trim() || undefined, //
			clinic: clinic.trim() || undefined, // Se vazio, envia undefined
		};

		const result = await execute(() => VaccineService.createPetVaccine(vaccineData), {
			showFullScreenLoading: true,
			loadingText: 'Saving vaccination...',
			successMessage: 'Vacina cadastrada com sucesso!',
		});

		if (result) {
			navigation.goBack();
		}
	};

	const doseLabel = (index: number) => (index === 0 ? '1ª dose' : `${index + 1}ª dose (reforço)`);

	const handleAddDose = () => {
		const lastDose = doses[doses.length - 1];
		setDoses([...doses, new Date(lastDose)]);
	};

	const handleRemoveDose = (index: number) => {
		setDoses(doses.filter((_, i) => i !== index));
	};

	const handleChangeDoseDate = (index: number, date: Date) => {
		setDoses(doses.map((d, i) => (i === index ? date : d)));
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
			<LoadingOverlay visible={isLoading} text="Saving vaccination..." />

			<Card style={styles.card}>
				<Card.Content>
					<List.Item title="Selecione uma Vacina" description={selectedVaccine ? selectedVaccine.name : 'Escolha uma vacina'} left={(props) => <List.Icon {...props} icon="needle" />} onPress={() => setShowVaccineDialog(true)} style={[styles.listItem, errors.vaccineId && styles.errorItem]} />
					{errors.vaccineId && (
						<HelperText type="error" visible={true}>
							{errors.vaccineId}
						</HelperText>
					)}

					<TextInput label="Veterinário" value={veterinarian} onChangeText={setVeterinarian} mode="outlined" style={styles.input} error={!!errors.veterinarian} />
					{errors.veterinarian && (
						<HelperText type="error" visible={true}>
							{errors.veterinarian}
						</HelperText>
					)}

					<TextInput label="Clínica" value={clinic} onChangeText={setClinic} mode="outlined" style={styles.input} error={!!errors.clinic} />
					{errors.clinic && (
						<HelperText type="error" visible={true}>
							{errors.clinic}
						</HelperText>
					)}

					<Text style={styles.dosesLabel}>Doses</Text>
					{doses.map((dose, index) => (
						<List.Item
							key={index}
							title={doseLabel(index)}
							description={formatDate(dose)}
							left={(props) => <List.Icon {...props} icon={index === 0 ? 'calendar' : 'calendar-clock'} />}
							onPress={() => setEditingDoseIndex(index)}
							right={(props) =>
								doses.length > 1 ? (
									<IconButton
										{...props}
										icon="delete"
										iconColor="#ff0000"
										onPress={(e) => {
											e.stopPropagation();
											handleRemoveDose(index);
										}}
									/>
								) : null
							}
							style={styles.listItem}
						/>
					))}
					{errors.doses && (
						<HelperText type="error" visible={true}>
							{errors.doses}
						</HelperText>
					)}

					<Button mode="outlined" onPress={handleAddDose} style={styles.addDoseButton} icon="plus">
						Adicionar dose futura
					</Button>

					<TextInput label="Observação" value={notes} onChangeText={setNotes} mode="outlined" multiline numberOfLines={4} style={styles.input} error={!!errors.notes} />
					{errors.notes && (
						<HelperText type="error" visible={true}>
							{errors.notes}
						</HelperText>
					)}

					{generalError && (
						<HelperText type="error" visible={true} style={styles.generalError}>
							{generalError}
						</HelperText>
					)}
				</Card.Content>
			</Card>

			<Button mode="contained" onPress={handleSubmit} style={styles.submitButton} disabled={!selectedVaccine || isLoading}>
				Salvar Vacina
			</Button>

			{/* Vaccine Selection Dialog */}
			{/* <Portal>
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
			</Portal> */}

			<Portal>
				<Dialog visible={showVaccineDialog} onDismiss={handleCloseDialog}>
					<Dialog.Title>Selecione a Vacina</Dialog.Title>
					<Dialog.Content>
						<View style={styles.paginationInfo}>
							<Text>
								Mostrando {Math.min(ITEMS_PER_PAGE * currentPage, vaccines.length)} de {vaccines.length} vacinas
							</Text>
						</View>

						{getCurrentPageItems().map((vaccine) => (
							<List.Item
								key={vaccine._id}
								title={truncateText(vaccine.name)}
								onPress={() => {
									setSelectedVaccine(vaccine);
									handleCloseDialog();
								}}
								right={(props) => (
									<IconButton
										{...props}
										icon="delete"
										iconColor="#ff0000"
										onPress={(e) => {
											e.stopPropagation();
											setVaccineToDelete(vaccine);
											setShowDeleteConfirm(true);
										}}
									/>
								)}
							/>
						))}

						<Divider style={styles.divider} />

						<View style={styles.paginationControls}>
							<IconButton icon="chevron-left" onPress={goToPrevPage} disabled={currentPage === 1} />
							<Text>
								Página {currentPage} de {totalPages}
							</Text>
							<IconButton icon="chevron-right" onPress={goToNextPage} disabled={currentPage === totalPages} />
						</View>
					</Dialog.Content>
				</Dialog>
				{/* Delete Confirmation Dialog */}
				<Dialog visible={showDeleteConfirm} onDismiss={() => setShowDeleteConfirm(false)}>
					<Dialog.Title>Deletar vacina</Dialog.Title>
					<Dialog.Content>
						<Text>Tem certeza de que deseja deletar {vaccineToDelete?.name}?</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setShowDeleteConfirm(false)}>Cancelar</Button>
						<Button onPress={handleDeleteVaccine} textColor="#ff0000">
							Deletar
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
			{/* Date Picker */}
			{editingDoseIndex !== null && (
				<DateTimePicker
					value={doses[editingDoseIndex]}
					mode="date"
					display="default"
					onChange={(event, date) => {
						const index = editingDoseIndex;
						setEditingDoseIndex(null);
						if (date && index !== null) {
							handleChangeDoseDate(index, date);
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
	paginationControls: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 8,
	},
	paginationInfo: {
		alignItems: 'center',
		marginBottom: 8,
	},
	divider: {
		marginVertical: 8,
	},
	dosesLabel: {
		marginTop: 8,
		marginBottom: 4,
		fontWeight: 'bold',
	},
	addDoseButton: {
		marginTop: 4,
		marginBottom: 16,
	},
});
