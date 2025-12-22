import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { mapBirdFromDB } from '@/utils/mappers';
import { Bird } from '@/types';

export function useBirds() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBirds = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('birds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedBirds = (data || []).map(mapBirdFromDB);
      setBirds(formattedBirds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar pássaros');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBird = async (bird: Omit<Bird, 'id' | 'logs' | 'weights'>) => {
    try {
      const dbBird = {
        name: bird.name,
        ring_number: bird.ringNumber,
        species: bird.species,
        mutation: bird.mutation,
        gender: bird.gender,
        birth_date: bird.birthDate,
        status: bird.status,
        cage: bird.cage,
        father_id: bird.fatherId,
        mother_id: bird.motherId,
        photo_url: bird.photoUrl,
        notes: bird.notes
      };

      const { data, error } = await supabase
        .from('birds')
        .insert([dbBird])
        .select()
        .single();

      if (error) throw error;

      const newBird = mapBirdFromDB(data);
      setBirds(prev => [newBird, ...prev]);
      return newBird;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchBirds();
  }, [fetchBirds]);

  return {
    birds,
    isLoading,
    error,
    refetch: fetchBirds,
    createBird
  };
}