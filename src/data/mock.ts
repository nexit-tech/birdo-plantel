import { Bird, Pair, Breeder, Transaction, DashboardStats } from '../types';

export const MOCK_BREEDER: Breeder = {
  id: 'user_01',
  name: 'Criadouro Solar',
  email: 'contato@solarares.com',
  registryNumber: 'CTF: 55920-1',
  phone: '(11) 99999-9999',
  city: 'São Paulo - SP'
};

export const MOCK_BIRDS: Bird[] = [
  {
    id: '1',
    name: 'Zeus',
    ringNumber: 'BR-2023-001',
    species: 'Agapornis Roseicollis',
    mutation: 'Opalino Verde',
    gender: 'MACHO',
    birthDate: '2023-01-14',
    status: 'REPRODUCAO',
    cage: 'Gaiola 01',
    notes: 'Excelente porte',
    logs: [],
    weights: [
      { id: 'w1', date: '2023-02-14', weight: 42, height: 12 },
      { id: 'w2', date: '2023-03-14', weight: 48, height: 13.5 },
      { id: 'w3', date: '2023-04-14', weight: 52, height: 14.5 },
      { id: 'w4', date: '2023-05-14', weight: 55, height: 15 },
    ]
  },
  {
    id: '2',
    name: 'Hera',
    ringNumber: 'BR-2023-002',
    species: 'Agapornis Roseicollis',
    mutation: 'Lutino',
    gender: 'FEMEA',
    birthDate: '2023-02-10',
    status: 'REPRODUCAO',
    cage: 'Gaiola 01',
    logs: [],
    weights: [
      { id: 'w1', date: '2023-03-10', weight: 45, height: 14 },
      { id: 'w2', date: '2023-04-10', weight: 50, height: 15 },
    ]
  },
  {
    id: '3',
    name: 'Filhote 01',
    ringNumber: 'BR-2023-015',
    species: 'Agapornis Roseicollis',
    mutation: 'Aqua Turquesa',
    gender: 'INDETERMINADO',
    birthDate: '2023-11-05',
    status: 'DISPONIVEL',
    cage: 'Voadora 01',
    fatherId: '1',
    motherId: '2',
    logs: [],
    weights: []
  },
  {
    id: '4',
    name: 'Thor',
    ringNumber: 'BR-2022-099',
    species: 'Calopsita',
    mutation: 'Cara Branca',
    gender: 'MACHO',
    birthDate: '2022-05-20',
    status: 'VENDIDO',
    cage: '-',
    logs: [],
    weights: []
  }
];

export const MOCK_PAIRS: Pair[] = [
  {
    id: 'p1',
    name: 'Casal Principal',
    maleId: '1',
    femaleId: '2',
    startDate: '2023-06-01',
    status: 'ATIVO',
    cage: 'Gaiola 01',
    cycles: [
      {
        id: 'c1',
        startDate: '2023-09-01',
        endDate: '2023-11-01',
        eggsCount: 5,
        hatchedCount: 4,
        status: 'CONCLUIDO',
        notes: 'Primeira postura, muito bem sucedida.'
      }
    ]
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    type: 'RECEITA',
    amount: 350.00,
    category: 'Venda de Aves',
    date: '2023-12-20',
    description: 'Venda Agapornis Roseicollis (Zeus)'
  },
  {
    id: 't2',
    type: 'DESPESA',
    amount: 120.50,
    category: 'Alimentação',
    date: '2023-12-15',
    description: 'Compra de Ração Nutrópica'
  }
];

export const MOCK_STATS: DashboardStats = {
  totalBirds: 45,
  totalPairs: 12,
  activeChicks: 8,
  availableForSale: 15
};