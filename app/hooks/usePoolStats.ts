import { useQuery } from '@tanstack/react-query';

export interface PoolStats {
  apr: number;
  volume24h: number;
  tvl: number;
  balances: Record<string, number>;
}

export interface PoolStatsResponse {
  mainPool: PoolStats;
  susdPool: PoolStats;
  usdsPool: PoolStats;
  usdyPool: PoolStats;
  cfusdPool: PoolStats;
}

export function usePoolStats() {
  return useQuery<PoolStatsResponse>({
    queryKey: ['pool-stats'],
    queryFn: async () => {
      const response = await fetch(`/api/get-pool-apr`);
      if (!response.ok) {
        throw new Error('Failed to fetch APR');
      }
      const data = await response.json();
      return data;
    },
  });
}
