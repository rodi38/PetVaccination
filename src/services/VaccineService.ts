import api from './api';
import { Vaccine, PetVaccine } from '../types';

interface VaccineCount {
	count: number;
}

export class VaccineService {
	static async getAllVaccines(): Promise<Vaccine[]> {
		const response = await api.get('/vaccines');
		return response.data;
	}

	static async getVaccineById(id: string): Promise<Vaccine> {
		const response = await api.get(`/vaccines/${id}`);
		return response.data;
	}

	static async getPetVaccines(petId: string): Promise<PetVaccine[]> {
		const response = await api.get(`/vaccines/pet/${petId}`);
		return response.data;
	}

	static async getPetVaccineCount(petId: string): Promise<number> {
		const response = await api.get<VaccineCount>(`vaccines/pet/${petId}/count`);
		return response.data.count;
	}

	static async createPetVaccine(data: Partial<PetVaccine>): Promise<PetVaccine> {
		const response = await api.post('/vaccines', data);
		return response.data;
	}

	static async updatePetVaccine(id: string, data: Partial<PetVaccine>): Promise<PetVaccine> {
		const response = await api.put(`/vaccines/${id}`, data);
		return response.data;
	}

	static async deletePetVaccine(id: string): Promise<void> {
		await api.delete(`/vaccines/${id}`);
	}
}
