import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { mapPairFromDB, mapCycleFromDB } from '@/utils/mappers';
import { Pair, BreedingCycle, PairStatus } from '@/types';

export function usePair(id: string) {
  const [pair, setPair] = useState<Pair | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

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

  const updatePair = async (updatedData: Partial<Pair>) => {
    if (!pair) return;

    try {
      const dbPair = {
        name: updatedData.name ?? pair.name,
        male_id: updatedData.maleId ?? pair.maleId,
        female_id: updatedData.femaleId ?? pair.femaleId,
        start_date: updatedData.startDate ?? pair.startDate,
        status: updatedData.status ?? pair.status,
        cage: updatedData.cage ?? pair.cage
      };

      const { data, error } = await supabase
        .from('pairs')
        .update(dbPair)
        .eq('id', id)
        .select(`
          *,
          cycles:breeding_cycles(*)
        `)
        .single();

      if (error) throw error;

      setPair(mapPairFromDB(data));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateStatus = async (status: PairStatus) => {
    await updatePair({ status });
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

    const { data, error } = await supabase
      .from('breeding_cycles')
      .update(dbCycle)
      .eq('id', cycle.id)
      .select()
      .single();

    if (!error && data) {
      const updatedCycle = mapCycleFromDB(data);
      setPair(prev => prev ? {
        ...prev,
        cycles: prev.cycles.map(c => c.id === cycle.id ? updatedCycle : c)
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
    updatePair, 
    updateStatus,
    addCycle,
    updateCycle,
    deleteCycle,
    deletePair,
    refetch: fetchPair
  };
}