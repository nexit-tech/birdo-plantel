'use client';

import { useState, useEffect } from 'react';
import { Pair } from '@/types';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import styles from './EditPairModal.module.css';

interface EditPairModalProps {
  isOpen: boolean;
  onClose: () => void;
  pair: Pair;
  onSave: (data: Partial<Pair>) => void;
}

export function EditPairModal({ isOpen, onClose, pair, onSave }: EditPairModalProps) {
  const [formData, setFormData] = useState({ name: '', cage: '' });

  useEffect(() => {
    if (isOpen) setFormData({ name: pair.name, cage: pair.cage });
  }, [isOpen, pair]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <SheetModal isOpen={isOpen} onClose={onClose} title="Editar Casal">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Nome</label>
          <input className={styles.input} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Gaiola</label>
          <input className={styles.input} value={formData.cage} onChange={e => setFormData({...formData, cage: e.target.value})} />
        </div>
        <button type="submit" className={styles.submitBtn}>Salvar</button>
      </form>
    </SheetModal>
  );
}