'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Bird, Gender, BirdStatus } from '@/types';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { Combobox } from '@/components/ui/Combobox/Combobox';
import styles from './AddBirdModal.module.css';

interface AddBirdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bird: Bird) => void;
  initialData?: Bird | null;
}

export function AddBirdModal({ isOpen, onClose, onSave, initialData }: AddBirdModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    ringNumber: '',
    species: '',
    mutation: '',
    gender: 'INDETERMINADO' as Gender,
    birthDate: '', // Inicializa VAZIO para evitar "data bugada"
    status: 'DISPONIVEL' as BirdStatus,
    cage: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          ringNumber: initialData.ringNumber,
          species: initialData.species,
          mutation: initialData.mutation || '',
          gender: initialData.gender,
          birthDate: initialData.birthDate || '', // Garante string vazia se null
          status: initialData.status,
          cage: initialData.cage || '',
          notes: initialData.notes || ''
        });
      } else {
        // Reset para Nova Ave
        setFormData({
          name: '',
          ringNumber: '',
          species: '',
          mutation: '',
          gender: 'INDETERMINADO',
          birthDate: '', // Mantém vazio para forçar o usuário a escolher
          status: 'DISPONIVEL',
          cage: '',
          notes: ''
        });
      }
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const birdToSave: Bird = {
      ...(initialData || {}), 
      id: initialData?.id || Math.random().toString(), 
      logs: initialData?.logs || [],
      weights: initialData?.weights || [],
      fatherId: initialData?.fatherId,
      motherId: initialData?.motherId,
      photoUrl: initialData?.photoUrl,
      ...formData,
      // Se a data estiver vazia, salvamos como null ou data atual dependendo da sua regra de negócio.
      // Aqui vou assumir que se estiver vazio, usa a data atual para não quebrar o banco, 
      // ou você pode obrigar o preenchimento no input colocando 'required'.
      birthDate: formData.birthDate || new Date().toISOString() 
    };

    onSave(birdToSave);
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

  const modalTitle = initialData ? `Editar ${initialData.name}` : 'Nova Ave';
  const buttonText = initialData ? 'Salvar Alterações' : 'Criar Ave';

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <h3 className={styles.title}>{modalTitle}</h3>
          <button onClick={onClose} className={styles.closeBtn} type="button">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <div className={styles.field}>
              <label className={styles.label}>Nome / Identificação</label>
              <input
                required
                className={styles.input}
                placeholder="Ex: Campeão 01"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Anilha</label>
                <input
                  required
                  className={styles.input}
                  placeholder="Ex: 2024-001"
                  value={formData.ringNumber}
                  onChange={(e) => handleChange('ringNumber', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                 <Combobox 
                  label="Gênero"
                  value={formData.gender}
                  options={genderOptions}
                  onChange={(val) => handleChange('gender', val)}
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.field}>
              <label className={styles.label}>Espécie</label>
              <input
                required
                className={styles.input}
                placeholder="Ex: Canário Belga"
                value={formData.species}
                onChange={(e) => handleChange('species', e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Mutação / Cor</label>
              <input
                className={styles.input}
                placeholder="Ex: Amarelo Intenso (Opcional)"
                value={formData.mutation}
                onChange={(e) => handleChange('mutation', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.row}>
               <div className={styles.field}>
                <DatePicker 
                  label="Nascimento"
                  value={formData.birthDate}
                  onChange={(date) => handleChange('birthDate', date)}
                  placeholder="Selecione"
                />
              </div>
               <div className={styles.field}>
                <label className={styles.label}>Gaiola</label>
                <input
                  className={styles.input}
                  placeholder="Nº (Opcional)"
                  value={formData.cage}
                  onChange={(e) => handleChange('cage', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <Combobox 
                label="Status Atual"
                value={formData.status}
                options={statusOptions}
                onChange={(val) => handleChange('status', val)}
              />
            </div>
          </div>

           <div className={styles.field}>
            <label className={styles.label}>Notas e Observações</label>
            <textarea
              className={styles.textarea}
              placeholder="Histórico, detalhes adicionais..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}