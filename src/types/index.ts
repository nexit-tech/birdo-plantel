export type Gender = 'MACHO' | 'FEMEA' | 'INDETERMINADO';
export type BirdStatus = 'DISPONIVEL' | 'REPRODUCAO' | 'VENDIDO' | 'OBITO';
export type PairStatus = 'ATIVO' | 'INCUBACAO' | 'ALIMENTANDO' | 'DESCANSO';
export type LogType = 'SAUDE' | 'REPRODUCAO' | 'ALIMENTACAO';
export type TransactionType = 'RECEITA' | 'DESPESA';

export interface BirdLog {
  id: string;
  type: LogType;
  date: string;
  title: string;
  notes?: string;
  icon: string;
}

export interface BirdWeight {
  id: string;
  date: string;
  weight: number; // gramas
  height?: number; // cm (novo campo)
}

export interface Bird {
  id: string;
  name: string;
  ringNumber: string;
  species: string;
  mutation: string;
  gender: Gender;
  birthDate: string;
  status: BirdStatus;
  cage: string;
  fatherId?: string;
  motherId?: string;
  photoUrl?: string;
  notes?: string;
  logs: BirdLog[];
  weights: BirdWeight[];
}

export interface BreedingCycle {
  id: string;
  startDate: string;
  endDate?: string;
  eggsCount: number;
  hatchedCount: number;
  notes?: string;
  status: 'EM_ANDAMENTO' | 'CONCLUIDO';
}

export interface Pair {
  id: string;
  name: string;
  maleId: string;
  femaleId: string;
  startDate: string;
  status: PairStatus;
  cage: string;
  cycles: BreedingCycle[];
}

export interface Breeder {
  id: string;
  name: string;
  email: string;
  registryNumber: string;
  phone: string;
  city: string;
  photoUrl?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface DashboardStats {
  totalBirds: number;
  totalPairs: number;
  activeChicks: number;
  availableForSale: number;
}