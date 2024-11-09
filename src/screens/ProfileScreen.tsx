import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Appbar } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { ProfileScreenProps } from '../types/navigation';

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
	const { user, signOut } = useAuth();

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => <Appbar.Action icon='logout' color='white' onPress={signOut} />,
		});
	}, [navigation, signOut]);

	return (
		<View style={styles.container}>
			<Card style={styles.card}>
				<Card.Content>
					<View style={styles.avatarContainer}>
						<View style={styles.avatar}>
							<Title style={styles.avatarText}>{user?.username ? user.username.charAt(0).toUpperCase() : ''}</Title>
						</View>
					</View>
					<Title style={styles.username}>{user?.username}</Title>
					<Paragraph style={styles.email}>{user?.email}</Paragraph>
				</Card.Content>
			</Card>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#f5f5f5',
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
});
