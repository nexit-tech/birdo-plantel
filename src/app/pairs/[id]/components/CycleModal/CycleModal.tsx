'use client';

import { useState, useEffect } from 'react';
import { BreedingCycle } from '@/types';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { Combobox } from '@/components/ui/Combobox/Combobox';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import styles from './CycleModal.module.css';

interface CycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BreedingCycle | null;
  onSave: (cycle: Omit<BreedingCycle, 'id'> | BreedingCycle) => void;
}

export function CycleModal({ isOpen, onClose, initialData, onSave }: CycleModalProps) {
  const [formData, setFormData] = useState<Partial<BreedingCycle>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {
        startDate: new Date().toISOString().split('T')[0],
        eggsCount: 0,
        hatchedCount: 0,
        status: 'EM_ANDAMENTO',
        notes: ''
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData?.id) {
      onSave({ ...formData, id: initialData.id } as BreedingCycle);
    } else {
      onSave(formData as Omit<BreedingCycle, 'id'>);
    }
    onClose();
  };

  return (
    <SheetModal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Ciclo' : 'Novo Ciclo'}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <DatePicker label="Início" value={formData.startDate || ''} onChange={d => setFormData({...formData, startDate: d})} />
          </div>
          <div className={styles.field}>
            <DatePicker label="Fim" value={formData.endDate || ''} onChange={d => setFormData({...formData, endDate: d})} />
          </div>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.counter}>
            <label>Ovos</label>
            <input type="number" value={formData.eggsCount} onChange={e => setFormData({...formData, eggsCount: Number(e.target.value)})} />
          </div>
          <div className={styles.divider} />
          <div className={styles.counter}>
            <label>Filhotes</label>
            <input type="number" value={formData.hatchedCount} onChange={e => setFormData({...formData, hatchedCount: Number(e.target.value)})} />
          </div>
        </div>

        <div className={styles.field}>
          <Combobox 
            label="Status" 
            value={formData.status || 'EM_ANDAMENTO'} 
            options={[{value: 'EM_ANDAMENTO', label: 'Em Andamento'}, {value: 'CONCLUIDO', label: 'Concluído'}]} 
            onChange={v => setFormData({...formData, status: v as any})} 
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Notas</label>
          <textarea className={styles.textarea} value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} />
        </div>

        <button type="submit" className={styles.submitBtn}>Salvar</button>
      </form>
    </SheetModal>
  );
}