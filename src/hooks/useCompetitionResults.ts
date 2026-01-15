import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CompetitionResult } from '@/types';

export function useCompetitionResults(birdId?: string) {
  const [results, setResults] = useState<CompetitionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const fetchResults = useCallback(async () => {
    if (!birdId) return;
    
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setResults([]);
        return;
      }

      const { data, error } = await supabase
        .from('competition_results')
        .select('*, birds!inner(user_id)')
        .eq('bird_id', birdId)
        .eq('birds.user_id', user.id)
        .order('event_date', { ascending: false });

      if (error) throw error;
      
      const cleanData = (data || []).map((item: any) => {
        const { birds, ...rest } = item;
        return rest as CompetitionResult;
      });

      setResults(cleanData);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    } finally {
      setIsLoading(false);
    }
  }, [birdId]);

  const addResult = async (result: Omit<CompetitionResult, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('competition_results')
        .insert([result])
        .select()
        .single();

      if (error) throw error;
      
      setResults(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Erro ao adicionar resultado:', error);
      throw error;
    }
  };

  const deleteResult = async (id: string) => {
    try {
      const { error } = await supabase
        .from('competition_results')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResults(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Erro ao deletar resultado:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return {
    results,
    isLoading,
    fetchResults,
    addResult,
    deleteResult
  };
}