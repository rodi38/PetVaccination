import api from './api';
import { Vaccine, PetVaccine, PetVaccineResponse, VaccinationRecord } from '../types';

interface VaccineCount {
	count: number;
}

interface CreateVaccinationDTO {
	vaccineId: string;
	vaccinationDate: string;
	notes?: string;
	veterinarian?: string;
	clinic?: string;
	nextDoseDate?: Date;
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

	static async getPetVaccines(petId: string): Promise<PetVaccineResponse> {
		const response = await api.get(`/vaccines/pets/${petId}`);
		return response.data;
	}

	static async getPetVaccineCount(petId: string): Promise<number> {
		const response = await api.get<VaccineCount>(`vaccines/pets/${petId}/count`);
		return response.data.count;
	}

	static async createPetVaccine(data: CreateVaccinationDTO): Promise<VaccinationRecord> {
		const response = await api.post('/vaccines/pets', data);
		return response.data;
	}

	static async updatePetVaccine(id: string, data: Partial<CreateVaccinationDTO>): Promise<VaccinationRecord> {
		const response = await api.put(`/vaccines/${id}`, data);
		return response.data;
	}

	static async createVaccine(data: Vaccine): Promise<Vaccine> {
		const response = await api.post('/vaccines', data);
		return response.data;
	}

	static async getPetVaccineDetails(vaccinationId: string, petId: string) {
		const response = await api.get(`/vaccines/${vaccinationId}/pets/${petId}`);
		return response.data;
	}

	static async deletePetVaccine(vaccineId: string, petId: string): Promise<void> {
		await api.delete(`/vaccines/${vaccineId}/pets/${petId}`);
	}

	static async deleteVaccine(vaccineId: string): Promise<void> {
		await api.delete(`/vaccines/${vaccineId}`);
	}
}
