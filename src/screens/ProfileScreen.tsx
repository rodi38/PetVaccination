import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Card, Title, Paragraph, Appbar, Portal, Modal, TextInput, Button, HelperText } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { ProfileScreenProps } from '../types/navigation';
import { AuthService } from '../services/AuthService';
import { useRequest } from '../hooks/useRequest';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
	const { user, signOut, updateUserContext } = useAuth(); // Adicione updateUserContext do contexto
	const [modalVisible, setModalVisible] = useState(false);
	const [username, setUsername] = useState(user?.username || '');
	const [email, setEmail] = useState(user?.email || '');
	const [showPasswordFields, setShowPasswordFields] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const { execute, isLoading, errors, generalError } = useRequest();

	// Função para resetar o formulário
	const resetForm = () => {
		setUsername(user?.username || '');
		setEmail(user?.email || '');
		setShowPasswordFields(false);
		setCurrentPassword('');
		setNewPassword('');
		setConfirmPassword('');
	};

	// Função para fechar o modal
	const handleCloseModal = () => {
		setModalVisible(false);
		resetForm();
	};

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => <Appbar.Action icon='logout' color='white' onPress={signOut} />,
		});
	}, [navigation, signOut]);

	const handleUpdate = async () => {
		if (!user?._id) {
			return;
		}

		const updateData: any = {
			username,
			email,
		};

		if (showPasswordFields) {
			if (newPassword !== confirmPassword) {
				// Você pode usar setErrors aqui se quiser mostrar o erro nos campos específicos
				return;
			}
			updateData.currentPassword = currentPassword;
			updateData.newPassword = newPassword;
		}

		const result = await execute(
			async () => {
				const updatedUser = await AuthService.updateUser(user._id, updateData);
				if (updateUserContext) {
					updateUserContext(updatedUser); // Atualiza o contexto com o usuário atualizado
				}
				handleCloseModal(); // Usa a nova função para fechar o modal
				return updatedUser;
			},
			{
				showFullScreenLoading: true,
				loadingText: 'Updating profile...',
			},
		);

		if (result) {
			// Atualização bem-sucedida
			// Você pode adicionar uma mensagem de sucesso aqui se desejar
		}
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<LoadingOverlay visible={isLoading} text='Updating pet...' />

			<Card style={styles.card}>
				<Card.Content>
					<View style={styles.avatarContainer}>
						<View style={styles.avatar}>
							<Title style={styles.avatarText}>{user?.username ? user.username.charAt(0).toUpperCase() : ''}</Title>
						</View>
					</View>
					<Title style={styles.username}>{user?.username}</Title>
					<Paragraph style={styles.email}>{user?.email}</Paragraph>
					<Button mode='contained' onPress={() => setModalVisible(true)} style={styles.editButton}>
						Editar Profile
					</Button>
				</Card.Content>
			</Card>

			<Portal>
				<Modal visible={modalVisible} onDismiss={handleCloseModal} contentContainerStyle={styles.modalContainer}>
					<ScrollView>
						<Title style={styles.modalTitle}>Edit Profile</Title>

						<TextInput label='Apelido' value={username} onChangeText={setUsername} mode='outlined' style={styles.input} error={!!errors.username} />
						{errors.username && (
							<HelperText type='error' visible={true}>
								{errors.username}
							</HelperText>
						)}

						<TextInput label='Email' value={email} onChangeText={setEmail} mode='outlined' style={styles.input} error={!!errors.email} />
						{errors.email && (
							<HelperText type='error' visible={true}>
								{errors.email}
							</HelperText>
						)}

						{/* {!showPasswordFields ? (
							<Button mode='text' onPress={() => setShowPasswordFields(true)} style={styles.changePasswordButton}>
								Change Password
							</Button>
						) : (
							<>
								<TextInput label='Current Password' value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry mode='outlined' style={styles.input} error={!!errors.currentPassword} />
								{errors.currentPassword && (
									<HelperText type='error' visible={true}>
										{errors.currentPassword}
									</HelperText>
								)}

								<TextInput label='New Password' value={newPassword} onChangeText={setNewPassword} secureTextEntry mode='outlined' style={styles.input} error={!!errors.newPassword} />
								{errors.newPassword && (
									<HelperText type='error' visible={true}>
										{errors.newPassword}
									</HelperText>
								)}

								<TextInput label='Confirm New Password' value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry mode='outlined' style={styles.input} error={!!errors.confirmPassword} />
								{errors.confirmPassword && (
									<HelperText type='error' visible={true}>
										{errors.confirmPassword}
									</HelperText>
								)}
							</>
						)}

						{generalError && (
							<HelperText type='error' visible={true}>
								{generalError}
							</HelperText>
						)} */}

						<View style={styles.buttonContainer}>
							<Button mode='outlined' onPress={handleCloseModal} style={styles.buttonCancel}>
								Cancelar
							</Button>
							<Button mode='contained' onPress={handleUpdate} loading={isLoading} disabled={isLoading} style={styles.buttonSave}>
								Salvar
							</Button>
						</View>
					</ScrollView>
				</Modal>
			</Portal>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	modalContainer: {
		backgroundColor: 'white',
		padding: 20,
		margin: 20,
		borderRadius: 8,
		maxHeight: '80%',
	},
	card: {
		elevation: 4,
		backgroundColor: 'white',
	},
	avatarContainer: {
		alignItems: 'center',
		marginBottom: 16,
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: '#2e7d32',
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: {
		color: 'white',
		fontSize: 32,
	},
	username: {
		textAlign: 'center',
		color: '#2e7d32',
		marginBottom: 8,
	},
	email: {
		textAlign: 'center',
		color: '#666',
	},
	editButton: {
		marginTop: 16,
		backgroundColor: '#2e7d32',
	},

	modalTitle: {
		textAlign: 'center',
		color: '#2e7d32',
		marginBottom: 20,
	},
	input: {
		marginBottom: 12,
		backgroundColor: 'white',
	},
	changePasswordButton: {
		marginVertical: 8,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
	},
	buttonCancel: {
		flex: 1,
		marginRight: 8,
		borderColor: '#2e7d32',
	},
	buttonSave: {
		flex: 1,
		marginLeft: 8,
		backgroundColor: '#2e7d32',
	},
});
