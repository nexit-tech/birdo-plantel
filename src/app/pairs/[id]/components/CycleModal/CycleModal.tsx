'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BreedingCycle } from '@/types';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { Combobox } from '@/components/ui/Combobox/Combobox';
import styles from './CycleModal.module.css';

interface CycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BreedingCycle | null;
  onSave: (cycle: BreedingCycle) => void;
}

export function CycleModal({ isOpen, onClose, initialData, onSave }: CycleModalProps) {
  const [formData, setFormData] = useState<Partial<BreedingCycle>>({
    startDate: new Date().toISOString().split('T')[0],
    eggsCount: 0,
    hatchedCount: 0,
    status: 'EM_ANDAMENTO',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          startDate: new Date().toISOString().split('T')[0],
          eggsCount: 0,
          hatchedCount: 0,
          status: 'EM_ANDAMENTO',
          notes: ''
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || Math.random().toString(),
      startDate: formData.startDate!,
      endDate: formData.endDate,
      eggsCount: Number(formData.eggsCount),
      hatchedCount: Number(formData.hatchedCount),
      status: formData.status as 'EM_ANDAMENTO' | 'CONCLUIDO',
      notes: formData.notes
    });
    onClose();
  };

  const statusOptions = [
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { value: 'CONCLUIDO', label: 'Concluído' }
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <h3 className={styles.title}>{initialData ? 'Editar Postura' : 'Nova Postura'}</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <DatePicker 
                label="Início"
                value={formData.startDate || ''}
                onChange={d => setFormData({...formData, startDate: d})}
              />
            </div>
            <div className={styles.field}>
              <DatePicker 
                label="Fim (Opcional)"
                value={formData.endDate || ''}
                onChange={d => setFormData({...formData, endDate: d})}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Total Ovos</label>
              <input 
                type="number"
                className={styles.input}
                value={formData.eggsCount}
                onChange={e => setFormData({...formData, eggsCount: Number(e.target.value)})}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Eclodiram</label>
              <input 
                type="number"
                className={styles.input}
                value={formData.hatchedCount}
                onChange={e => setFormData({...formData, hatchedCount: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className={styles.field}>
            <Combobox 
              label="Status"
              value={formData.status || 'EM_ANDAMENTO'}
              options={statusOptions}
              onChange={(val) => setFormData({...formData, status: val as any})}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Notas</label>
            <textarea 
              className={styles.textarea}
              placeholder="Observações sobre a postura..."
              value={formData.notes || ''}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>Salvar</button>
        </form>
      </div>
    </div>
  );
}