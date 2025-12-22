'use client';

import { useState, useEffect } from 'react';
import { LogType } from '@/types';
import { X } from 'lucide-react';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import styles from './AddLogModal.module.css';

// Exportando a interface para ser usada na page.tsx
export interface LogData {
  id?: string;
  title: string;
  date: string;
  notes?: string | null;
  icon: string;
}

interface AddLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: LogType;
  initialData?: LogData | null;
  onSave: (data: LogData) => void;
}

export function AddLogModal({ isOpen, onClose, type, initialData, onSave }: AddLogModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        date: initialData.date,
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const iconMap: Record<LogType, string> = {
      SAUDE: '💊',
      REPRODUCAO: '❤️',
      ALIMENTACAO: '🥗'
    };
    
    onSave({
      id: initialData?.id,
      title: formData.title,
      date: formData.date,
      notes: formData.notes,
      icon: iconMap[type]
    });
    
    onClose();
  };

  const getTitle = () => {
    if (initialData) return 'Editar Registro';
    if (type === 'SAUDE') return 'Novo Registro de Saúde';
    if (type === 'REPRODUCAO') return 'Registro Reprodutivo';
    return 'Registro de Alimentação';
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <h3 className={styles.title}>{getTitle()}</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Título</label>
            <input 
              required
              className={styles.input} 
              placeholder="Ex: Vermífugo, Ovos..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className={styles.field}>
            <DatePicker 
              label="Data"
              value={formData.date}
              onChange={(date) => setFormData({...formData, date})}
              placeholder="DD/MM/AAAA"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Observações</label>
            <textarea 
              className={styles.textarea} 
              placeholder="Detalhes adicionais..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            {initialData ? 'Salvar Alterações' : 'Salvar Registro'}
          </button>
        </form>
      </div>
    </div>
  );
}