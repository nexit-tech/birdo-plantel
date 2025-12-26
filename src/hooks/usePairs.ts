import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Pair } from '@/types';

export interface PairWithNames extends Pair {
  maleName?: string;
  femaleName?: string;
}

export function usePairs() {
  const [pairs, setPairs] = useState<PairWithNames[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchPairs = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pairs')
        .select(`
          *,
          male:birds!male_id(name),
          female:birds!female_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPairs = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        maleId: item.male_id,
        femaleId: item.female_id,
        startDate: item.start_date,
        status: item.status,
        cage: item.cage,
        cycles: item.cycles || [],
        maleName: item.male?.name,
        femaleName: item.female?.name
      }));

      setPairs(formattedPairs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar casais');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPair = async (pair: Omit<Pair, 'id' | 'cycles'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const dbPair = {
        user_id: user.id,
        name: pair.name,
        male_id: pair.maleId,
        female_id: pair.femaleId,
        start_date: pair.startDate,
        status: pair.status,
        cage: pair.cage
      };

      const { data, error } = await supabase
        .from('pairs')
        .insert([dbPair])
        .select()
        .single();

      if (error) throw error;

      await fetchPairs();
      return data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchPairs();
  }, [fetchPairs]);

  return {
    pairs,
    isLoading,
    error,
    refetch: fetchPairs,
    createPair
  };
}