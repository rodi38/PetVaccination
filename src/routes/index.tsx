import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Login } from '../screens/Login';
import { Register } from '../screens/Register';
import { HomeScreen } from '../screens/HomeScreen';
import { PetDetailsScreen } from '../screens/PetDetailsScreen';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import { AddPet } from '../screens/AddPet';
import { ProfileScreen } from '../screens/ProfileScreen';

// Tipando o Stack com os parâmetros definidos
const Stack = createStackNavigator<RootStackParamList>();

export const Routes = () => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size='large' color='#2e7d32' />
			</View>
		);
	}

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerStyle: {
						backgroundColor: '#2e7d32',
					},
					headerTintColor: '#fff',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
				}}
			>
				{user ? (
					// Rotas autenticadas
					<>
						<Stack.Screen name='Home' component={HomeScreen} options={{ title: 'My Pets' }} />
						<Stack.Screen name='PetDetails' component={PetDetailsScreen} options={{ title: 'Pet Details' }} />
						<Stack.Screen name='AddPet' component={AddPet} options={{ title: 'Add New Pet' }} />
						<Stack.Screen name='Profile' component={ProfileScreen} options={{ title: 'Profile' }} />
					</>
				) : (
					// Rotas não autenticadas
					<>
						<Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
						<Stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};
