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

    const cleanWeight = weight.replace(',', '.');
    const cleanHeight = height.replace(',', '.');
    const payloadId = initialData?.id || ''; 

    onSave({
      id: payloadId, 
      date,
      weight: Number(cleanWeight),
      height: cleanHeight ? Number(cleanHeight) : undefined
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
              type="text" 
              inputMode="decimal"
              required
              className={styles.input}
              placeholder="Ex: 50.5"
              value={weight}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[\d.,]*$/.test(val)) setWeight(val);
              }}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Tamanho (cm)</label>
            <input 
              type="text"
              inputMode="decimal"
              className={styles.input}
              placeholder="Ex: 15"
              value={height}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[\d.,]*$/.test(val)) setHeight(val);
              }}
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