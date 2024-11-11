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
import { AddVaccination } from '../screens/AddVaccinationScreen';
import { VaccinationDetailsScreen } from '../screens/VaccinationDetailsScreen';
import { AddVaccineType } from '../screens/AddVaccineTypeScreen';

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
						<Stack.Screen name='Home' component={HomeScreen} options={{ title: 'Meus Pets' }} />
						<Stack.Screen name='PetDetails' component={PetDetailsScreen} options={{ title: 'Detalhes do Pet' }} />
						<Stack.Screen name='AddPet' component={AddPet} options={{ title: 'Adicionar Pet' }} />
						<Stack.Screen name='Profile' component={ProfileScreen} options={{ title: 'Perfil' }} />
						<Stack.Screen name='AddVaccination' component={AddVaccination} options={{ title: 'Adicionar Vacinação' }} />
						<Stack.Screen name='VaccinationDetails' component={VaccinationDetailsScreen} options={{ title: 'Detalhes da Vacinação' }} />
						<Stack.Screen name='AddVaccineType' component={AddVaccineType} options={{ title: 'Adicionar novo tipo de vacina' }} />
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
