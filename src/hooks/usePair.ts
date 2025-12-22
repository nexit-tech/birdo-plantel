import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { mapPairFromDB, mapCycleFromDB } from '@/utils/mappers';
import { Pair, BreedingCycle, PairStatus } from '@/types';

export function usePair(id: string) {
  const [pair, setPair] = useState<Pair | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPair = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pairs')
        .select(`
          *,
          cycles:breeding_cycles(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setPair(mapPairFromDB(data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchPair();
  }, [id, fetchPair]);

  const updateStatus = async (status: PairStatus) => {
    await supabase.from('pairs').update({ status }).eq('id', id);
    setPair(prev => prev ? { ...prev, status } : null);
  };

  const addCycle = async (cycle: Omit<BreedingCycle, 'id'>) => {
    const dbCycle = {
      pair_id: id,
      start_date: cycle.startDate,
      eggs_count: cycle.eggsCount,
      hatched_count: cycle.hatchedCount,
      notes: cycle.notes,
      status: cycle.status
    };

    const { data, error } = await supabase
      .from('breeding_cycles')
      .insert([dbCycle])
      .select()
      .single();

    if (!error && data) {
      setPair(prev => prev ? { 
        ...prev, 
        cycles: [mapCycleFromDB(data), ...prev.cycles] 
      } : null);
    }
  };

  const updateCycle = async (cycle: BreedingCycle) => {
    const dbCycle = {
      start_date: cycle.startDate,
      end_date: cycle.endDate,
      eggs_count: cycle.eggsCount,
      hatched_count: cycle.hatchedCount,
      notes: cycle.notes,
      status: cycle.status
    };

    const { error } = await supabase
      .from('breeding_cycles')
      .update(dbCycle)
      .eq('id', cycle.id);

    if (!error) {
      setPair(prev => prev ? {
        ...prev,
        cycles: prev.cycles.map(c => c.id === cycle.id ? cycle : c)
      } : null);
    }
  };

  const deleteCycle = async (cycleId: string) => {
    await supabase.from('breeding_cycles').delete().eq('id', cycleId);
    setPair(prev => prev ? { 
      ...prev, 
      cycles: prev.cycles.filter(c => c.id !== cycleId) 
    } : null);
  };

  const deletePair = async () => {
    await supabase.from('pairs').delete().eq('id', id);
  };

  return {
    pair,
    loading,
    updateStatus,
    addCycle,
    updateCycle,
    deleteCycle,
    deletePair,
    refetch: fetchPair
  };
}