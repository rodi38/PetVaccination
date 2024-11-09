import { CreatePetDTO, Pet } from '../types';
import api from './api';

export class PetService {
	static async getAllPets(): Promise<Pet[]> {
		const response = await api.get('/pets');
		return response.data;
	}

	static async getAllPetsByOwnerId(ownerId?: string): Promise<Pet[] | undefined> {
		try {
			const response = await api.get(`pets/owner/${ownerId}`);
			return response.data;
		} catch (error) {
			console.error('Error fetching pets:', error);
		}
	}

	static async getPetById(id: string): Promise<Pet> {
		const response = await api.get(`/pets/${id}`);
		return response.data;
	}

	static async createPet(petData: CreatePetDTO): Promise<Pet> {
		const response = await api.post('/pets', petData);
		return response.data;
	}

	static async updatePet(id: string, petData: Partial<CreatePetDTO>): Promise<Pet> {
		const response = await api.put(`/pets/${id}`, petData);
		return response.data;
	}

	static async deletePet(id: string): Promise<void> {
		await api.delete(`/pets/${id}`);
	}
}
