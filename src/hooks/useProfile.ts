import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { mapProfileFromDB } from '@/utils/mappers';
import { Breeder } from '@/types';

export function useProfile() {
  const [profile, setProfile] = useState<Breeder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(mapProfileFromDB(data));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = async (updatedData: Breeder) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const dbProfile = {
        name: updatedData.name,
        email: updatedData.email,
        registry_number: updatedData.registryNumber,
        phone: updatedData.phone,
        city: updatedData.city,
        photo_url: updatedData.photoUrl
      };

      const { error } = await supabase
        .from('profiles')
        .update(dbProfile)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(updatedData);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    updateProfile,
    refetch: fetchProfile
  };
}