import { 
  Bird, 
  Gender, 
  BirdStatus, 
  BirdLog, 
  BirdWeight, 
  LogType, 
  Pair, 
  PairStatus, 
  BreedingCycle, 
  Transaction, 
  TransactionType,
  Breeder
} from '@/types';

interface LogDB {
  id: string;
  type: LogType;
  date: string;
  title: string;
  notes?: string;
  icon: string;
}

interface WeightDB {
  id: string;
  date: string;
  weight: number;
  height?: number;
}

interface BirdDB {
  id: string;
  name: string;
  ring_number: string;
  species: string;
  mutation: string;
  gender: Gender;
  birth_date: string;
  status: BirdStatus;
  cage: string;
  father_id?: string;
  mother_id?: string;
  photo_url?: string;
  notes?: string;
  logs?: LogDB[];
  weights?: WeightDB[];
}

interface CycleDB {
  id: string;
  start_date: string;
  end_date?: string;
  eggs_count: number;
  hatched_count: number;
  notes?: string;
  status: 'EM_ANDAMENTO' | 'CONCLUIDO';
}

interface PairDB {
  id: string;
  name: string;
  male_id: string;
  female_id: string;
  start_date: string;
  status: PairStatus;
  cage: string;
  cycles?: CycleDB[];
}

interface TransactionDB {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  description: string;
}

interface ProfileDB {
  id: string;
  name: string;
  email: string;
  registry_number: string;
  phone: string;
  city: string;
  photo_url?: string;
}

export function mapLogFromDB(data: LogDB): BirdLog {
  return {
    id: data.id,
    type: data.type,
    date: data.date,
    title: data.title,
    notes: data.notes,
    icon: data.icon
  };
}

export function mapWeightFromDB(data: WeightDB): BirdWeight {
  return {
    id: data.id,
    date: data.date,
    weight: data.weight,
    height: data.height
  };
}

export function mapBirdFromDB(data: BirdDB): Bird {
  return {
    id: data.id,
    name: data.name,
    ringNumber: data.ring_number,
    species: data.species,
    mutation: data.mutation,
    gender: data.gender,
    birthDate: data.birth_date,
    status: data.status,
    cage: data.cage,
    fatherId: data.father_id,
    motherId: data.mother_id,
    photoUrl: data.photo_url,
    notes: data.notes,
    logs: data.logs ? data.logs.map(mapLogFromDB) : [],
    weights: data.weights ? data.weights.map(mapWeightFromDB) : []
  };
}

export function mapCycleFromDB(data: CycleDB): BreedingCycle {
  return {
    id: data.id,
    startDate: data.start_date,
    endDate: data.end_date,
    eggsCount: data.eggs_count,
    hatchedCount: data.hatched_count,
    notes: data.notes,
    status: data.status
  };
}

export function mapPairFromDB(data: PairDB): Pair {
  return {
    id: data.id,
    name: data.name,
    maleId: data.male_id,
    femaleId: data.female_id,
    startDate: data.start_date,
    status: data.status,
    cage: data.cage,
    cycles: data.cycles ? data.cycles.map(mapCycleFromDB) : []
  };
}

export function mapTransactionFromDB(data: TransactionDB): Transaction {
  return {
    id: data.id,
    type: data.type,
    amount: data.amount,
    category: data.category,
    date: data.date,
    description: data.description
  };
}

export function mapProfileFromDB(data: ProfileDB): Breeder {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    registryNumber: data.registry_number,
    phone: data.phone,
    city: data.city,
    photoUrl: data.photo_url
  };
}