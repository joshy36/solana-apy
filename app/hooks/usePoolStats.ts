import { useQuery } from '@tanstack/react-query';

interface PoolAprResponse {
  apr: number;
  volume24h: number;
  balances: {
    USDC: number;
    USDT: number;
    PYUSD: number;
  };
  tvl: number;
}

export function usePoolStats({ tokenAddress }: { tokenAddress: string }) {
  return useQuery<PoolAprResponse>({
    queryKey: ['pool-apr', tokenAddress],
    queryFn: async () => {
      const response = await fetch(`/api/get-pool-apr?pool=seed`);
      if (!response.ok) {
        throw new Error('Failed to fetch APR');
      }

      return response.json();
    },
  });
}
