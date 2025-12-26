import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { mapTransactionFromDB } from '@/utils/mappers';
import { Transaction } from '@/types';

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions((data || []).map(mapTransactionFromDB));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const dbTransaction = {
      user_id: user.id,
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      description: transaction.description
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([dbTransaction])
      .select()
      .single();

    if (error) throw error;

    const newTransaction = mapTransactionFromDB(data);
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = async (transaction: Transaction) => {
    const dbTransaction = {
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      description: transaction.description
    };

    const { data, error } = await supabase
      .from('transactions')
      .update(dbTransaction)
      .eq('id', transaction.id)
      .select()
      .single();

    if (error) throw error;

    const updatedTransaction = mapTransactionFromDB(data);
    setTransactions(prev => 
      prev.map(t => t.id === transaction.id ? updatedTransaction : t)
    );
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
}