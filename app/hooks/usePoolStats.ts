import { useState, useEffect } from 'react';
import { Connection } from '@solana/web3.js';
import {
  TOKEN_ACCOUNT_PYUSD,
  TOKEN_ACCOUNT_USDC,
  TOKEN_ACCOUNT_USDT,
} from '../constants';

export const usePoolStats = () => {
  const [balances, setBalances] = useState<Record<string, number | null>>({
    USDC: null,
    USDT: null,
    PYUSD: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalances = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const connection = new Connection(
        process.env.NEXT_PUBLIC_QUICKNODE_RPC_URL!
      );

      const results = await Promise.all(
        Object.entries({
          USDC: TOKEN_ACCOUNT_USDC,
          USDT: TOKEN_ACCOUNT_USDT,
          PYUSD: TOKEN_ACCOUNT_PYUSD,
        }).map(async ([token, pubkey]) => {
          const balance = await connection.getTokenAccountBalance(pubkey);
          return [token, balance.value.uiAmount];
        })
      );

      setBalances(Object.fromEntries(results));
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  return {
    balances,
    isLoading,
    error,
    refetch: fetchBalances,
  };
};
