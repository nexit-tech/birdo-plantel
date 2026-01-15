import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface DashboardStats {
  totalBirds: number;
  totalPairs: number;
  activeChicks: number;
  availableForSale: number;
}

let cachedData: DashboardStats | null = null;

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>(cachedData || {
    totalBirds: 0,
    totalPairs: 0,
    activeChicks: 0,
    availableForSale: 0
  });
  
  const [isLoading, setIsLoading] = useState(!cachedData);
  const supabase = createClient();

  const fetchStats = useCallback(async (forceReload = false) => {
    if (cachedData && !forceReload) {
      setStats(cachedData);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setStats({ totalBirds: 0, totalPairs: 0, activeChicks: 0, availableForSale: 0 });
        return;
      }

      const { count: birdsCount } = await supabase
        .from('birds')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .neq('status', 'VENDIDO')
        .neq('status', 'OBITO');

      const { count: pairsCount } = await supabase
        .from('pairs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { count: availableCount } = await supabase
        .from('birds')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'DISPONIVEL');

      // Busca ciclos ativos filtrando pelos casais do usuário via join
      const { data: cycles } = await supabase
        .from('breeding_cycles')
        .select('hatched_count, pairs!inner(user_id)')
        .eq('pairs.user_id', user.id)
        .eq('status', 'EM_ANDAMENTO');

      const chicksCount = cycles?.reduce((acc, curr) => acc + (curr.hatched_count || 0), 0) || 0;

      const newStats: DashboardStats = {
        totalBirds: birdsCount || 0,
        totalPairs: pairsCount || 0,
        availableForSale: availableCount || 0,
        activeChicks: chicksCount
      };

      cachedData = newStats;
      setStats(newStats);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, refetch: () => fetchStats(true) };
}