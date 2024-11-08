// src/types/navigation.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
	Login: undefined;
	Register: undefined;
	Home: undefined;
	PetDetails: { petId: string };
	AddPet: undefined;
	AddVaccination: { petId: string };
	Profile: undefined; // Add this line
};

export type NavigationProp = NativeStackScreenProps<RootStackParamList>;

// Helpers para componentes específicos
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type PetDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'PetDetails'>;
export type AddPetScreenProps = NativeStackScreenProps<RootStackParamList, 'AddPet'>;
export type AddVaccinationScreenProps = NativeStackScreenProps<RootStackParamList, 'AddVaccination'>;
export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>; // Add this line
