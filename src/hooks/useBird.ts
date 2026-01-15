import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { mapBirdFromDB, mapLogFromDB, mapWeightFromDB } from '@/utils/mappers';
import { Bird, BirdLog, BirdWeight, BirdStatus, ShareSettings } from '@/types';

export function useBird(id: string) {
  const [bird, setBird] = useState<Bird | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchBird = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setBird(null);
        return;
      }

      const { data, error } = await supabase
        .from('birds')
        .select(`
          *,
          logs:bird_logs(*),
          weights:bird_weights(*)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setBird(mapBirdFromDB(data));
    } catch (error) {
      console.error("Erro ao buscar ave:", error);
      setBird(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBird();
  }, [fetchBird]);

  const updateBird = async (updatedData: Partial<Bird>) => {
    if (!bird) return;

    try {
      const mergedBird = { ...bird, ...updatedData };

      const dbBird = {
        name: mergedBird.name,
        ring_number: mergedBird.ringNumber,
        species: mergedBird.species,
        mutation: mergedBird.mutation,
        gender: mergedBird.gender,
        birth_date: mergedBird.birthDate,
        status: mergedBird.status,
        cage: mergedBird.cage,
        father_id: mergedBird.fatherId,
        mother_id: mergedBird.motherId,
        photo_url: mergedBird.photoUrl,
        notes: mergedBird.notes
      };

      const { data, error } = await supabase
        .from('birds')
        .update(dbBird)
        .eq('id', id)
        .select(`
          *,
          logs:bird_logs(*),
          weights:bird_weights(*)
        `)
        .single();

      if (error) throw error;

      setBird(mapBirdFromDB(data));
    } catch (error) {
      console.error("Erro ao atualizar ave:", error);
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
      console.error("Erro ao deletar ave:", error);
      throw error;
    }
  };

  const updateStatus = async (status: BirdStatus) => {
    await updateBird({ status });
  };

  const addLog = async (log: Omit<BirdLog, 'id'>) => {
    const { data, error } = await supabase
      .from('bird_logs')
      .insert([{ 
        bird_id: id,
        type: log.type,
        title: log.title,
        notes: log.notes,
        date: log.date,
        icon: log.icon
      }])
      .select()
      .single();
    
    if (!error && data) {
      setBird(prev => prev ? { ...prev, logs: [mapLogFromDB(data), ...prev.logs] } : null);
    }
  };

  const updateLog = async (log: BirdLog) => {
    const { data, error } = await supabase
      .from('bird_logs')
      .update({ 
        title: log.title, 
        notes: log.notes, 
        date: log.date, 
        icon: log.icon 
      })
      .eq('id', log.id)
      .select()
      .single();

    if (!error && data) {
      const updatedLog = mapLogFromDB(data);
      setBird(prev => prev ? {
        ...prev,
        logs: prev.logs.map(l => l.id === log.id ? updatedLog : l)
      } : null);
    }
  };

  const deleteLog = async (logId: string) => {
    await supabase.from('bird_logs').delete().eq('id', logId);
    setBird(prev => prev ? { ...prev, logs: prev.logs.filter(l => l.id !== logId) } : null);
  };

  const parseNumber = (value: string | number | undefined | null): number | null => {
    if (value === undefined || value === null || value === '') return null;
    if (typeof value === 'number') return value;
    const cleanValue = value.toString().replace(',', '.').replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? null : parsed;
  };

  const saveWeight = async (weightData: Partial<BirdWeight>) => {
    try {
      const weightId = weightData.id;
      const isEdit = !!weightId;
      
      const weightVal = parseNumber(weightData.weight);
      const heightVal = parseNumber(weightData.height);

      if (weightVal === null) {
        throw new Error("O valor do peso é obrigatório.");
      }

      let dateVal = new Date().toISOString();
      if (weightData.date) {
        const d = new Date(weightData.date);
        if (!isNaN(d.getTime())) {
          dateVal = d.toISOString();
        }
      }

      const payload = {
        weight: weightVal,
        height: heightVal,
        date: dateVal,
        ...(isEdit ? {} : { bird_id: id })
      };
      
      const query = supabase.from('bird_weights');

      const { data, error } = await (isEdit 
        ? query.update(payload).eq('id', weightId).select().single()
        : query.insert([payload]).select().single()
      );

      if (error) {
        throw error;
      }

      if (data) {
        const newWeight = mapWeightFromDB(data);
        setBird(prev => {
          if (!prev) return null;
          const list = isEdit 
            ? prev.weights.map(w => w.id === newWeight.id ? newWeight : w)
            : [newWeight, ...prev.weights];
          
          return { 
            ...prev, 
            weights: list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
          };
        });
      }
    } catch (e) {
      console.error("Erro ao salvar peso (função):", e);
      throw e;
    }
  };

  const deleteWeight = async (weightId: string) => {
    await supabase.from('bird_weights').delete().eq('id', weightId);
    setBird(prev => prev ? { ...prev, weights: prev.weights.filter(w => w.id !== weightId) } : null);
  };

  const updateParent = async (type: 'PAI' | 'MAE', parentId?: string) => {
    const field = type === 'PAI' ? 'father_id' : 'mother_id';

    const { error } = await supabase
        .from('birds')
        .update({ [field]: parentId || null })
        .eq('id', id);
        
    if (error) throw error;

    setBird(prev => prev ? { 
      ...prev, 
      fatherId: type === 'PAI' ? parentId : prev.fatherId,
      motherId: type === 'MAE' ? parentId : prev.motherId 
    } : null);
  };

  const togglePrivacy = async (isPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('birds')
        .update({ is_public: isPublic })
        .eq('id', id);

      if (error) throw error;
      setBird(prev => prev ? { ...prev, isPublic } : null);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateShareSettings = async (settings: ShareSettings) => {
    try {
      const { error } = await supabase
        .from('birds')
        .update({ share_settings: settings })
        .eq('id', id);

      if (error) throw error;
      
      setBird(prev => prev ? { ...prev, shareSettings: settings } : null);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
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
    togglePrivacy,
    updateShareSettings,
    refetch: fetchBird
  };
}