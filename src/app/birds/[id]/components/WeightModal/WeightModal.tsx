'use client';

import { useState, useEffect } from 'react';
import { BirdWeight } from '@/types';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import styles from './WeightModal.module.css';

interface WeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BirdWeight | null;
  onSave: (weight: BirdWeight) => void;
}

export function WeightModal({ isOpen, onClose, initialData, onSave }: WeightModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDate(initialData.date);
        setWeight(initialData.weight.toString());
        setHeight(initialData.height ? initialData.height.toString() : '');
      } else {
        setDate(new Date().toISOString().split('T')[0]);
        setWeight('');
        setHeight('');
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || Math.random().toString(),
      date,
      weight: Number(weight),
      height: height ? Number(height) : undefined
    });
    onClose();
  };

  return (
    <SheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Biometria' : 'Nova Biometria'}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <DatePicker 
            label="Data"
            value={date}
            onChange={setDate}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Peso (g)</label>
            <input 
              type="number"
              required
              className={styles.input}
              placeholder="Ex: 50"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Tamanho (cm)</label>
            <input 
              type="number"
              className={styles.input}
              placeholder="Ex: 15"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={!weight}>
          {initialData ? 'Salvar Alterações' : 'Salvar Registro'}
        </button>
      </form>
    </SheetModal>
  );
}