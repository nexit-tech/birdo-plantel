import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { mapPairFromDB } from '@/utils/mappers';
import { Pair } from '@/types';

export function usePairs() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPairs = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pairs')
        .select(`
          *,
          cycles:breeding_cycles(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPairs((data || []).map(mapPairFromDB));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPair = async (pair: Omit<Pair, 'id' | 'cycles'>) => {
    const dbPair = {
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

    const newPair = mapPairFromDB(data);
    setPairs(prev => [newPair, ...prev]);
    return newPair;
  };

  useEffect(() => {
    fetchPairs();
  }, [fetchPairs]);

  return {
    pairs,
    isLoading,
    createPair,
    refetch: fetchPairs
  };
}