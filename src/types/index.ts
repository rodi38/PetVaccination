export interface User {
	_id: string;
	username: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
}
export interface Pet {
	_id: string;
	name: string;
	petType: string;
	breed: string;
	gender: string;
	age: number; // calculado pelo backend a partir de birthDate
	birthDate: string;
	owner: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface PaginatedResponse<T> {
	items: T[];
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface Vaccine {
	_id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface VaccinationRecord {
	_id: string; 
	vaccine: Vaccine;
	vaccinationDate: string;
	notes?: string;
	veterinarian?: string;
	clinic?: string;
	nextDoseDate?: string;
}

export interface VaccinationDetailsResponse {
	vaccine: Vaccine;
	petVaccine: PetVaccine;
}

export interface PetVaccineResponse {
	petId: string;
	items: VaccinationRecord[];
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface PetVaccine {
	_id: string;
	petId: string;
	vaccineId: string;
	vaccinationDate: Date;
	notes?: string;
	veterinarian?: string;
	clinic?: string;
	nextDoseDate?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreatePetDTO {
	name: string;
	petType: string;
	breed: string;
	gender: string;
	birthDate: string; // ISO date-time
}

export const petTypes = {
	Dog: 'Cachorro',
	Cat: 'Gato',
	Bird: 'Pássaro',
	Other: 'Outro',
};

export interface vaccineType {
	Rabies: 'Rabies';
	Distemper: 'Distemper';
	Parvovirus: 'Parvovirus';
}

export interface VaccineCount {
	count: number;
}
