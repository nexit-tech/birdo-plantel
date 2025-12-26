'use client';

import { useState } from 'react';
import { Pair, PairStatus, Bird } from '@/types';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { Combobox } from '@/components/ui/Combobox/Combobox';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import styles from './NewPairModal.module.css';

interface NewPairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pair: Omit<Pair, 'id' | 'cycles'>) => void;
  availableMales: Bird[];
  availableFemales: Bird[];
}

export function NewPairModal({ isOpen, onClose, onSave, availableMales, availableFemales }: NewPairModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    maleId: '',
    femaleId: '',
    startDate: new Date().toISOString().split('T')[0],
    cage: '',
    status: 'ATIVO' as PairStatus
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.maleId || !formData.femaleId) return;
    onSave(formData);
    onClose();
    setFormData({
      name: '',
      maleId: '',
      femaleId: '',
      startDate: new Date().toISOString().split('T')[0],
      cage: '',
      status: 'ATIVO'
    });
  };

  const maleOptions = availableMales.map(b => ({ value: b.id, label: `${b.name} (${b.ringNumber})` }));
  const femaleOptions = availableFemales.map(b => ({ value: b.id, label: `${b.name} (${b.ringNumber})` }));

  return (
    <SheetModal isOpen={isOpen} onClose={onClose} title="Novo Casal">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Nome</label>
          <input
            required
            className={styles.input}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Ex: Casal Principal"
          />
        </div>
        
        <div className={styles.row}>
          <div className={styles.field}>
            <Combobox label="Macho" value={formData.maleId} options={maleOptions} onChange={(v) => setFormData({...formData, maleId: v})} />
          </div>
          <div className={styles.field}>
            <Combobox label="Fêmea" value={formData.femaleId} options={femaleOptions} onChange={(v) => setFormData({...formData, femaleId: v})} />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <DatePicker label="Início" value={formData.startDate} onChange={(d) => setFormData({...formData, startDate: d})} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Gaiola</label>
            <input className={styles.input} value={formData.cage} onChange={(e) => setFormData({...formData, cage: e.target.value})} />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>Criar Casal</button>
      </form>
    </SheetModal>
  );
}