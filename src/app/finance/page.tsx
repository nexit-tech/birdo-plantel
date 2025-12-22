'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header/Header';
import { Card } from '@/components/ui/Card/Card';
import { TransactionRow } from './components/TransactionRow/TransactionRow';
import { TransactionModal } from './components/TransactionModal/TransactionModal';
import { FinanceChart } from './components/FinanceChart/FinanceChart';
import { ConfirmModal } from '@/components/ui/ConfirmModal/ConfirmModal';
import { useFinance } from '@/hooks'; // Hook conectado
import { Transaction } from '@/types';
import { Plus, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import styles from './page.module.css';

function FinanceContent() {
  // Substituindo useState(MOCK) pelo hook do Supabase
  const { transactions, isLoading, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Transaction | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setEditingItem(null);
      setIsModalOpen(true);
      router.replace('/finance', { scroll: false });
    }
  }, [searchParams, router]);

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false, title: '', message: '', onConfirm: () => {}
  });

  // Mantendo sua lógica original de cálculo
  const income = transactions.filter(t => t.type === 'RECEITA').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = transactions.filter(t => t.type === 'DESPESA').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expense;

  const handleSave = async (data: Transaction) => {
    // Se o item já tem ID e estamos editando (existe no array), é update
    // Caso contrário, é create.
    // O Modal gera um ID fake se for novo, mas vamos ignorar isso no addTransaction
    
    if (editingItem) {
      await updateTransaction(data);
    } else {
      // Removemos o ID gerado pelo frontend para deixar o banco criar o UUID real
      const { id, ...newTransaction } = data;
      await addTransaction(newTransaction);
    }
    setIsModalOpen(false);
  };

  const handleEdit = (item: Transaction) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Excluir Transação?',
      message: 'Esta ação removerá o registro financeiro permanentemente.',
      onConfirm: async () => {
        await deleteTransaction(id);
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <Header 
        title="Finanças" 
        action={
          <button className={styles.addButton} onClick={handleAddNew}>
            <Plus size={24} />
          </button>
        }
      />

      <div className={styles.scrollContent}>
        <div className={styles.summaryGrid}>
          <Card className={styles.balanceCard}>
            <div className={styles.balanceHeader}>
              <span className={styles.cardLabel}>Saldo Atual</span>
              <Wallet size={20} className={styles.balanceIcon} />
            </div>
            <span className={styles.balanceValue}>R$ {balance.toFixed(2)}</span>
          </Card>
          
          <div className={styles.miniCards}>
             <Card className={styles.miniCard}>
                <div className={styles.miniIconIncome}><TrendingUp size={16} /></div>
                <div>
                   <span className={styles.miniLabel}>Receitas</span>
                   <span className={styles.miniValueIncome}>R$ {income.toFixed(2)}</span>
                </div>
             </Card>
             <Card className={styles.miniCard}>
                <div className={styles.miniIconExpense}><TrendingDown size={16} /></div>
                <div>
                   <span className={styles.miniLabel}>Despesas</span>
                   <span className={styles.miniValueExpense}>R$ {expense.toFixed(2)}</span>
                </div>
             </Card>
          </div>
        </div>

        <FinanceChart income={income} expense={expense} />

        <div className={styles.sectionTitle}>ÚLTIMAS TRANSAÇÕES</div>
        <div className={styles.list}>
          {isLoading && transactions.length === 0 ? (
             <div className={styles.emptyState}>Carregando...</div>
          ) : (
            <>
              {transactions.map(transaction => (
                <TransactionRow 
                  key={transaction.id} 
                  transaction={transaction}
                  onEdit={() => handleEdit(transaction)}
                  onDelete={() => handleDelete(transaction.id)}
                />
              ))}
              {transactions.length === 0 && (
                 <div className={styles.emptyState}>Nenhuma transação registrada.</div>
              )}
            </>
          )}
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
        onSave={handleSave}
      />

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default function FinancePage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <FinanceContent />
    </Suspense>
  );
}