'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Bird, Gender, BirdStatus } from '@/types';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { Combobox } from '@/components/ui/Combobox/Combobox';
import styles from './AddBirdModal.module.css';

interface AddBirdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bird: Bird) => void;
}

export function AddBirdModal({ isOpen, onClose, onSave }: AddBirdModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    ringNumber: '',
    species: '',
    mutation: '',
    gender: 'INDETERMINADO' as Gender,
    birthDate: '',
    status: 'DISPONIVEL' as BirdStatus,
    cage: '',
    initialWeight: '' // Novo campo
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBird: Bird = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      logs: [],
      weights: formData.initialWeight ? [{
        id: Math.random().toString(),
        date: new Date().toISOString().split('T')[0],
        weight: Number(formData.initialWeight)
      }] : []
    };

    onSave(newBird);
    setFormData({
      name: '',
      ringNumber: '',
      species: '',
      mutation: '',
      gender: 'INDETERMINADO',
      birthDate: '',
      status: 'DISPONIVEL',
      cage: '',
      initialWeight: ''
    });
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const genderOptions = [
    { value: 'MACHO', label: 'Macho' },
    { value: 'FEMEA', label: 'Fêmea' },
    { value: 'INDETERMINADO', label: 'Indeterminado' }
  ];

  const statusOptions = [
    { value: 'DISPONIVEL', label: 'Disponível' },
    { value: 'REPRODUCAO', label: 'Em Reprodução' },
    { value: 'VENDIDO', label: 'Vendido' },
    { value: 'OBITO', label: 'Óbito' }
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <h3 className={styles.title}>Nova Ave</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Nome</label>
              <input
                required
                className={styles.input}
                placeholder="Ex: Zeus"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Anilha</label>
              <input
                required
                className={styles.input}
                placeholder="BR-2024-..."
                value={formData.ringNumber}
                onChange={(e) => handleChange('ringNumber', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Espécie</label>
            <input
              required
              className={styles.input}
              placeholder="Ex: Agapornis Roseicollis"
              value={formData.species}
              onChange={(e) => handleChange('species', e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mutação</label>
            <input
              required
              className={styles.input}
              placeholder="Ex: Opalino Verde"
              value={formData.mutation}
              onChange={(e) => handleChange('mutation', e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <Combobox 
                label="Gênero"
                value={formData.gender}
                options={genderOptions}
                onChange={(val) => handleChange('gender', val)}
              />
            </div>
            <div className={styles.field}>
              <DatePicker 
                label="Nascimento"
                value={formData.birthDate}
                onChange={(date) => handleChange('birthDate', date)}
                placeholder="DD/MM/AAAA"
              />
            </div>
          </div>

          <div className={styles.row}>
             <div className={styles.field}>
              <Combobox 
                label="Status"
                value={formData.status}
                options={statusOptions}
                onChange={(val) => handleChange('status', val)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Peso Inicial (g)</label>
              <input
                type="number"
                className={styles.input}
                placeholder="Ex: 45"
                value={formData.initialWeight}
                onChange={(e) => handleChange('initialWeight', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Gaiola</label>
            <input
              className={styles.input}
              placeholder="Nº ou Nome"
              value={formData.cage}
              onChange={(e) => handleChange('cage', e.target.value)}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Cadastrar Ave
          </button>
        </form>
      </div>
    </div>
  );
}