'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Transaction, TransactionType } from '@/types';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { Combobox } from '@/components/ui/Combobox/Combobox';
import styles from './TransactionModal.module.css';
import clsx from 'clsx';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Transaction | null;
  onSave: (data: Transaction) => void;
}

export function TransactionModal({ isOpen, onClose, initialData, onSave }: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>('RECEITA');
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setFormData({
        amount: initialData.amount.toString(),
        category: initialData.category,
        date: initialData.date,
        description: initialData.description
      });
    } else {
      setType('RECEITA');
      setFormData({ 
        amount: '', 
        category: '', 
        date: new Date().toISOString().split('T')[0], 
        description: '' 
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || Math.random().toString(),
      type,
      amount: Number(formData.amount.replace(',', '.')),
      category: formData.category,
      date: formData.date,
      description: formData.description
    });
  };

  const incomeCategories = [
    { value: 'Venda de Aves', label: 'Venda de Aves' },
    { value: 'Acessórios', label: 'Acessórios' },
    { value: 'Outros', label: 'Outros' }
  ];

  const expenseCategories = [
    { value: 'Alimentação', label: 'Alimentação' },
    { value: 'Saúde', label: 'Saúde / Remédios' },
    { value: 'Equipamentos', label: 'Gaiolas / Equipamentos' },
    { value: 'Manutenção', label: 'Manutenção' },
    { value: 'Outros', label: 'Outros' }
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {initialData ? 'Editar Transação' : 'Nova Transação'}
          </h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.typeSelector}>
            <button
              type="button"
              className={clsx(styles.typeBtn, type === 'RECEITA' && styles.active)}
              onClick={() => setType('RECEITA')}
              style={type === 'RECEITA' ? { color: '#10b981' } : {}}
            >
              Receita
            </button>
            <button
              type="button"
              className={clsx(styles.typeBtn, type === 'DESPESA' && styles.active)}
              onClick={() => setType('DESPESA')}
              style={type === 'DESPESA' ? { color: '#ef4444' } : {}}
            >
              Despesa
            </button>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Valor (R$)</label>
            <input 
              type="number"
              step="0.01"
              required
              className={styles.input}
              placeholder="0,00"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          <div className={styles.field}>
            <Combobox 
              label="Categoria"
              value={formData.category}
              options={type === 'RECEITA' ? incomeCategories : expenseCategories}
              onChange={val => setFormData({...formData, category: val})}
            />
          </div>
          
          <div className={styles.field}>
            <DatePicker 
              label="Data"
              value={formData.date}
              onChange={d => setFormData({...formData, date: d})}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Descrição</label>
            <input 
              className={styles.input}
              placeholder="Ex: Compra de ração..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            <Check size={20} />
            {initialData ? 'Salvar Alterações' : 'Registrar'}
          </button>
        </form>
      </div>
    </div>
  );
}