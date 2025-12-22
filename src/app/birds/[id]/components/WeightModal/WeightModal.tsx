'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BirdWeight } from '@/types';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import styles from './WeightModal.module.css';

interface WeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BirdWeight | null; // Novo prop para edição
  onSave: (weight: BirdWeight) => void;
}

export function WeightModal({ isOpen, onClose, initialData, onSave }: WeightModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  // Preencher formulário ao abrir para edição
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDate(initialData.date);
        setWeight(initialData.weight.toString());
        setHeight(initialData.height ? initialData.height.toString() : '');
      } else {
        // Resetar para novo registro
        setDate(new Date().toISOString().split('T')[0]);
        setWeight('');
        setHeight('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || Math.random().toString(), // Mantém ID se editando, cria novo se criando
      date,
      weight: Number(weight),
      height: height ? Number(height) : undefined
    });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <h3 className={styles.title}>{initialData ? 'Editar Biometria' : 'Nova Biometria'}</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
        </div>

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
      </div>
    </div>
  );
}