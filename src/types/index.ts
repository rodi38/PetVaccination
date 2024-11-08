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
	age: number;
	owner: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Vaccine {
	_id: string;
	name: string;
	description?: string;
	createdAt: Date;
	updatedAt: Date;
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
	age: number;
	owner: string; // ID do usuário
}

export interface petType {
	Dog: 'Cachorro';
	Cat: 'Gato';
	Bird: 'Pássaro';
	Reptile: 'Réptil';
	Other: 'Other';
}

export interface vaccineType {
	Rabies: 'Rabies';
	Distemper: 'Distemper';
	Parvovirus: 'Parvovirus';
}

export interface VaccineCount {
	count: number;
}

export const breed = {
	DogBreed: [
		'Labrador Retriever',
		'Pastor Alemão',
		'Golden Retriever',
		'Bulldog Inglês',
		'Poodle',
		'Beagle',
		'Rottweiler',
		'Dachshund (Teckel)',
		'Boxer',
		'Husky Siberiano',
		'Chihuahua',
		'Dog Alemão',
		'Shih Tzu',
		'Dobermann',
		'Border Collie',
		'Yorkshire Terrier',
		'Cocker Spaniel Inglês',
		'Pastor Australiano',
		'Pug',
		'Bichon Frisé',
		'Bulldog Francês',
		'Cavalier King Charles Spaniel',
		'Akita Inu',
		'Maltês',
		'Pastor de Shetland',
		'Boston Terrier',
		'Bernese Mountain Dog (Boiadeiro Bernês)',
		'Shiba Inu',
		'Malamute do Alasca',
		'Weimaraner',
		'São Bernardo',
		'Spaniel Springer Inglês',
		'Havanês',
		'Bull Terrier',
		'Dálmata',
		'Setter Irlandês',
		'Terra Nova',
		'Pequinês',
		'Whippet',
		'Papillon',
		'Jack Russell Terrier',
		'Chow Chow',
		'Rhodesian Ridgeback',
		'Cane Corso',
		'Airedale Terrier',
		'Lhasa Apso',
		'Samoyeda',
		'Basset Hound',
		'Scottish Terrier (Terrier Escocês)',
		'Schnauzer Miniatura',
		'Staffordshire Terrier Americano',
		'Elkhound Norueguês',
		'Basenji',
		'Pastor Belga Malinois',
		'Lobão Irlandês (Irish Wolfhound)',
		'Cão de Água Português',
		'Galgo Italiano',
		'Keeshond',
		'Brittany (Epagneul Breton)',
		'Old English Sheepdog (Bobtail)',
		'Spitz Alemão (ou Lulu da Pomerânia)',
		'Greyhound (Galgo Inglês)',
		'Cairn Terrier',
		'Afghan Hound (Galgo Afegão)',
		'Wheaten Terrier de Pêlo Macio',
		'Fox Terrier de Pêlo Duro',
		'Mastim Tibetano',
		'Norwich Terrier',
		'Spitz Americano',
		'Boiadeiro Australiano',
		'Spaniel Japonês (ou Chin Japonês)',
		'Corgi Galês Pembroke',
		'Corgi Galês Cardigan',
		'Pointer',
		'Vizsla (Braco Húngaro)',
		'Collie',
		'Retriever de Pêlo Liso',
		'Schnauzer Gigante',
		'Pharaoh Hound (Cão do Faraó)',
		'Bloodhound (Cão de Santo Humberto)',
		'Boerboel',
		'Mastim Inglês',
		'Kerry Blue Terrier',
		'Leonberger',
		'Saluki',
		'Terrier Tibetano',
		'N/A',
	],

	CatBreed: [
		'Persa',
		'Siamês',
		'Maine Coon',
		'Ragdoll',
		'Bengal',
		'Sphynx',
		'Britânico de Pelo Curto',
		'Abissínio',
		'Birmanês (Birman)',
		'Russian Blue (Azul Russo)',
		'Chartreux',
		'Himalaio',
		'Norueguês da Floresta',
		'Scottish Fold',
		'Savannah',
		'American Shorthair (Americano de Pelo Curto)',
		'Oriental de Pelo Curto',
		'Devon Rex',
		'Cornish Rex',
		'Angorá Turco',
		'Selkirk Rex',
		'Bombaim',
		'Ocicat',
		'Manx',
		'Snowshoe',
		'Tonquinês',
		'Somali',
		'Laperm',
		'Toyger',
		'Singapura',
		'Balinês',
		'Burmilla',
		'Munchkin',
		'Korat',
		'Siberiano',
		'Bobtail Japonês',
		'Peterbald',
		'Van Turco',
		'Egyptian Mau',
		'Chantilly-Tiffany',
		'Pixie-bob',
		'Cymric',
		'American Curl',
		'Havana Brown',
		'Lykoi',
		'N/A',
	],

	BirdBreed: [
		'Calopsita',
		'Periquito Australiano',
		'Canário',
		'Papagaio Verdadeiro',
		'Agapornis (Inseparável)',
		'Cacatua',
		'Arara Azul',
		'Arara Canindé',
		'Pintassilgo',
		'Curió',
		'Coleiro',
		'Sabiá Laranjeira',
		'Tucano Toco',
		'Maritaca',
		'Mandarim',
		'Mainá',
		'Diamante Gould',
		'Cardeal do Sul',
		'Manon',
		'Rosela',
		'Forpus (Tuim)',
		'Ring Neck',
		'Pardal',
		'Jandaia',
		'Lóris',
		'Cacatua Galah',
		'Bicudo',
		'Tico-tico',
		'Bem-te-vi',
		'Trinca-ferro',
		'Beija-flor',
		'Faisão Dourado',
		'Pomba Diamante',
		'Galo da Serra',
		'Araçari',
		'Canário da Terra',
		'Corrupião',
		'Saíra Sete Cores',
		'Tico-tico Rei',
		'Tangará',
		'N/A',
	],
};

export const gender = {
	Male: 'male',
	Female: 'female',
	Other: 'other',
};
