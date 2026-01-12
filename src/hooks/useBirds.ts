import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import { mapBirdFromDB } from '@/utils/mappers';
import { Bird } from '@/types';

export function useBirds() {
  const supabase = createClient();

  const fetcher = async () => {
    const { data, error } = await supabase
      .from('birds')
      .select('*, logs:bird_logs(*), weights:bird_weights(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((item: any) => mapBirdFromDB(item));
  };

  const { data: birds = [], error, isLoading, mutate } = useSWR('birds', fetcher);

  const createBird = async (bird: Omit<Bird, 'id' | 'logs' | 'weights'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const dbBird = {
        user_id: user.id,
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
        .select('*, logs:bird_logs(*), weights:bird_weights(*)')
        .single();

      if (error) throw error;

      const newBird = mapBirdFromDB(data);
      
      await mutate([newBird, ...birds], { revalidate: false });
      return newBird;
    } catch (err) {
      throw err;
    }
  };

  const updateBird = async (bird: Bird) => {
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
        .update(dbBird)
        .eq('id', bird.id)
        .select('*, logs:bird_logs(*), weights:bird_weights(*)')
        .single();

      if (error) throw error;

      const updated = mapBirdFromDB(data);
      
      await mutate(
        birds.map(b => b.id === bird.id ? updated : b),
        { revalidate: false }
      );
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteBird = async (id: string) => {
    try {
      const { error } = await supabase
        .from('birds')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await mutate(
        birds.filter(b => b.id !== id),
        { revalidate: false }
      );
    } catch (err) {
      throw err;
    }
  };

  return {
    birds,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Erro ao carregar dados') : null,
    refetch: () => mutate(),
    createBird,
    updateBird, 
    deleteBird  
  };
}