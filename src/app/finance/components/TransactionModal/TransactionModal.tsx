'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
      setFormData({ amount: '', category: '', date: new Date().toISOString().split('T')[0], description: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || Math.random().toString(), // ID temporário, será tratado no page.tsx
      type,
      amount: Number(formData.amount.replace(',', '.')),
      category: formData.category,
      date: formData.date,
      description: formData.description
    });
    // Não fechamos aqui, o pai fecha após o save async
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
      <div className={styles.sheet}>
        <div className={styles.header}>
          <h3 className={styles.title}>{initialData ? 'Editar Transação' : 'Nova Transação'}</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.switchContainer}>
            <button
              type="button"
              className={clsx(styles.switchBtn, type === 'RECEITA' && styles.activeIncome)}
              onClick={() => setType('RECEITA')}
            >
              Receita
            </button>
            <button
              type="button"
              className={clsx(styles.switchBtn, type === 'DESPESA' && styles.activeExpense)}
              onClick={() => setType('DESPESA')}
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
              className={styles.inputMoney}
              placeholder="0,00"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          <div className={styles.row}>
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

          <button type="submit" className={clsx(styles.submitBtn, type === 'RECEITA' ? styles.btnIncome : styles.btnExpense)}>
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
}