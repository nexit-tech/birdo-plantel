import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { mapBirdFromDB, mapLogFromDB, mapWeightFromDB } from '@/utils/mappers';
import { Bird, BirdLog, BirdWeight, BirdStatus } from '@/types';

export function useBird(id: string) {
  const [bird, setBird] = useState<Bird | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBird = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('birds')
        .select(`
          *,
          logs:bird_logs(*),
          weights:bird_weights(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setBird(mapBirdFromDB(data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchBird();
  }, [id, fetchBird]);

  const updateBird = async (updatedData: Partial<Bird>) => {
    try {
      const dbBird = {
        name: updatedData.name,
        ring_number: updatedData.ringNumber,
        species: updatedData.species,
        mutation: updatedData.mutation,
        gender: updatedData.gender,
        birth_date: updatedData.birthDate,
        status: updatedData.status,
        cage: updatedData.cage,
        father_id: updatedData.fatherId,
        mother_id: updatedData.motherId,
        photo_url: updatedData.photoUrl,
        notes: updatedData.notes
      };

      const { error } = await supabase
        .from('birds')
        .update(dbBird)
        .eq('id', id);

      if (error) throw error;

      setBird(prev => prev ? { ...prev, ...updatedData } : null);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteBird = async () => {
    try {
      const { error } = await supabase
        .from('birds')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateStatus = async (status: BirdStatus) => {
    await supabase.from('birds').update({ status }).eq('id', id);
    setBird(prev => prev ? { ...prev, status } : null);
  };

  const addLog = async (log: Omit<BirdLog, 'id'>) => {
    const { data, error } = await supabase
      .from('bird_logs')
      .insert([{ ...log, bird_id: id }])
      .select()
      .single();
    
    if (!error && data) {
      setBird(prev => prev ? { ...prev, logs: [mapLogFromDB(data), ...prev.logs] } : null);
    }
  };

  const updateLog = async (log: BirdLog) => {
    const { error } = await supabase
      .from('bird_logs')
      .update({ title: log.title, notes: log.notes, date: log.date, icon: log.icon })
      .eq('id', log.id);

    if (!error) {
      setBird(prev => prev ? {
        ...prev,
        logs: prev.logs.map(l => l.id === log.id ? log : l)
      } : null);
    }
  };

  const deleteLog = async (logId: string) => {
    await supabase.from('bird_logs').delete().eq('id', logId);
    setBird(prev => prev ? { ...prev, logs: prev.logs.filter(l => l.id !== logId) } : null);
  };

  const saveWeight = async (weight: Omit<BirdWeight, 'id'> | BirdWeight) => {
    const isEdit = 'id' in weight;
    const payload = isEdit ? weight : { ...weight, bird_id: id };
    
    const query = supabase.from('bird_weights');
    const { data, error } = await (isEdit 
      ? query.update(payload).eq('id', (weight as BirdWeight).id)
      : query.insert([payload])).select().single();

    if (!error && data) {
      const newWeight = mapWeightFromDB(data);
      setBird(prev => {
        if (!prev) return null;
        const list = isEdit 
          ? prev.weights.map(w => w.id === newWeight.id ? newWeight : w)
          : [newWeight, ...prev.weights];
        return { ...prev, weights: list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
      });
    }
  };

  const deleteWeight = async (weightId: string) => {
    await supabase.from('bird_weights').delete().eq('id', weightId);
    setBird(prev => prev ? { ...prev, weights: prev.weights.filter(w => w.id !== weightId) } : null);
  };

  const updateParent = async (type: 'PAI' | 'MAE', parentId?: string) => {
    const field = type === 'PAI' ? 'father_id' : 'mother_id';
    await supabase.from('birds').update({ [field]: parentId || null }).eq('id', id);
    setBird(prev => prev ? { 
      ...prev, 
      fatherId: type === 'PAI' ? parentId : prev.fatherId,
      motherId: type === 'MAE' ? parentId : prev.motherId 
    } : null);
  };

  return {
    bird,
    loading,
    updateBird,
    deleteBird,
    updateStatus,
    addLog,
    updateLog,
    deleteLog,
    saveWeight,
    deleteWeight,
    updateParent,
    refetch: fetchBird
  };
}