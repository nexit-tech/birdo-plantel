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
  onSave: (pair: Pair) => void;
  availableMales: Bird[];
  availableFemales: Bird[];
}

export function NewPairModal({ 
  isOpen, 
  onClose, 
  onSave, 
  availableMales, 
  availableFemales 
}: NewPairModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    maleId: '',
    femaleId: '',
    startDate: '',
    cage: '',
    status: 'ATIVO' as PairStatus
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.maleId || !formData.femaleId) {
      return;
    }

    const newPair: Pair = {
      id: Math.random().toString(),
      ...formData,
      cycles: []
    };

    onSave(newPair);
    setFormData({
      name: '',
      maleId: '',
      femaleId: '',
      startDate: '',
      cage: '',
      status: 'ATIVO'
    });
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const maleOptions = availableMales.map(b => ({ value: b.id, label: `${b.name} (${b.ringNumber})` }));
  const femaleOptions = availableFemales.map(b => ({ value: b.id, label: `${b.name} (${b.ringNumber})` }));

  return (
    <SheetModal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Casal"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Nome do Casal</label>
          <input
            required
            className={styles.input}
            placeholder="Ex: Casal Principal"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <Combobox 
              label="Macho"
              value={formData.maleId}
              options={maleOptions}
              onChange={(val) => handleChange('maleId', val)}
            />
          </div>
          <div className={styles.field}>
            <Combobox 
              label="Fêmea"
              value={formData.femaleId}
              options={femaleOptions}
              onChange={(val) => handleChange('femaleId', val)}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <DatePicker 
              label="Data Início"
              value={formData.startDate}
              onChange={(date) => handleChange('startDate', date)}
              placeholder="DD/MM/AAAA"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Gaiola</label>
            <input
              className={styles.input}
              placeholder="Nº"
              value={formData.cage}
              onChange={(e) => handleChange('cage', e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Formar Casal
        </button>
      </form>
    </SheetModal>
  );
}