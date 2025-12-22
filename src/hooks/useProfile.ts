import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { mapProfileFromDB } from '@/utils/mappers';
import { Breeder } from '@/types';

export function useProfile() {
  const [profile, setProfile] = useState<Breeder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'admin@birdoplantel.com')
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
      .eq('id', profile?.id);

    if (error) throw error;

    setProfile(updatedData);
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