import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useDashboard() {
  const [stats, setStats] = useState({
    totalBirds: 0,
    totalPairs: 0,
    activeChicks: 0,
    availableForSale: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);

      const { count: birdsCount } = await supabase
        .from('birds')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'VENDIDO')
        .neq('status', 'OBITO');

      const { count: pairsCount } = await supabase
        .from('pairs')
        .select('*', { count: 'exact', head: true });

      const { count: availableCount } = await supabase
        .from('birds')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'DISPONIVEL');

      const { data: cycles } = await supabase
        .from('breeding_cycles')
        .select('hatched_count')
        .eq('status', 'EM_ANDAMENTO');

      const chicksCount = cycles?.reduce((acc, curr) => acc + (curr.hatched_count || 0), 0) || 0;

      setStats({
        totalBirds: birdsCount || 0,
        totalPairs: pairsCount || 0,
        availableForSale: availableCount || 0,
        activeChicks: chicksCount
      });

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, refetch: fetchStats };
}