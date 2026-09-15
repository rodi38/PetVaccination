import api from './api';
import { Vaccine, PetVaccineResponse, VaccinationRecord, PaginatedResponse } from '../types';

interface VaccineCount {
	count: number;
}

interface CreateVaccinationDTO {
	petId: string;
	vaccineId: string;
	vaccinationDate: string;
	notes?: string;
	veterinarian?: string;
	clinic?: string;
	nextDoseDate?: string;
}

type UpdateVaccinationDTO = Partial<Omit<CreateVaccinationDTO, 'petId' | 'vaccineId'>>;

export class VaccineService {
	static async getAllVaccines(): Promise<PaginatedResponse<Vaccine>> {
		const response = await api.get('/vaccines');
		return response.data;
	}
	static async getVaccineById(id: string): Promise<Vaccine> {
		const response = await api.get(`/vaccines/${id}`);
		return response.data;
	}

	static async getPetVaccines(petId: string): Promise<PetVaccineResponse> {
		const response = await api.get(`/pets/${petId}/vaccinations`);
		return response.data;
	}

	static async getPetVaccineCount(petId: string): Promise<number> {
		const response = await api.get<VaccineCount>(`/pets/${petId}/vaccinations/count`);
		return response.data.count;
	}

	static async createPetVaccine(data: CreateVaccinationDTO): Promise<VaccinationRecord> {
		const { petId, ...body } = data;
		const response = await api.post(`/pets/${petId}/vaccinations`, body);
		return response.data;
	}

	static async updatePetVaccine(petId: string, vaccineId: string, data: UpdateVaccinationDTO): Promise<VaccinationRecord> {
		const response = await api.put(`/pets/${petId}/vaccinations/${vaccineId}`, data);
		return response.data;
	}

	static async createVaccine(data: Vaccine): Promise<Vaccine> {
		const response = await api.post('/vaccines', data);
		return response.data;
	}

	static async getPetVaccineDetails(petId: string, vaccineId: string) {
		const response = await api.get(`/pets/${petId}/vaccinations/${vaccineId}`);
		return response.data;
	}

	static async deletePetVaccine(petId: string, vaccineId: string): Promise<void> {
		await api.delete(`/pets/${petId}/vaccinations/${vaccineId}`);
	}

	static async deleteVaccine(vaccineId: string): Promise<void> {
		await api.delete(`/vaccines/${vaccineId}`);
	}
}
