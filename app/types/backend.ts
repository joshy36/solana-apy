import {
  TOKEN_ACCOUNT_PYUSD,
  TOKEN_ACCOUNT_USDC,
  TOKEN_ACCOUNT_USDT,
  TOKEN_ACCOUNT_SUSD_USDSTAR_POOL_1,
  TOKEN_ACCOUNT_SUSD_USDSTAR_POOL_2,
  TOKEN_ACCOUNT_USDS_USDSTAR_POOL_1,
  TOKEN_ACCOUNT_USDS_USDSTAR_POOL_2,
  TOKEN_ACCOUNT_USDY_USDSTAR_POOL_1,
  TOKEN_ACCOUNT_USDY_USDSTAR_POOL_2,
  TOKEN_ACCOUNT_CFUSD_USDSTAR_POOL_1,
  TOKEN_ACCOUNT_CFUSD_USDSTAR_POOL_2,
} from '../constants';
import { PublicKey } from '@solana/web3.js';

export type PoolConfig = {
  type: string;
  tokenAccounts: PublicKey[];
  tokenNames: string[];
};

export type PoolData = {
  apr: string;
  volume24h: number;
  tvl: number;
  balances: Record<string, number>;
};

export const FEE_PERCENTAGE = 0.0001;
export const DAYS_IN_YEAR = 365;

export const POOLS: Record<string, PoolConfig> = {
  main: {
    type: 'main',
    tokenAccounts: [
      TOKEN_ACCOUNT_USDC,
      TOKEN_ACCOUNT_USDT,
      TOKEN_ACCOUNT_PYUSD,
    ],
    tokenNames: ['USDC', 'USDT', 'PYUSD'],
  },
  susd: {
    type: 'susd',
    tokenAccounts: [
      TOKEN_ACCOUNT_SUSD_USDSTAR_POOL_1,
      TOKEN_ACCOUNT_SUSD_USDSTAR_POOL_2,
    ],
    tokenNames: ['sUSD', 'USDstar'],
  },
  usds: {
    type: 'usds',
    tokenAccounts: [
      TOKEN_ACCOUNT_USDS_USDSTAR_POOL_1,
      TOKEN_ACCOUNT_USDS_USDSTAR_POOL_2,
    ],
    tokenNames: ['USDS', 'USDstar'],
  },
  usdy: {
    type: 'usdy',
    tokenAccounts: [
      TOKEN_ACCOUNT_USDY_USDSTAR_POOL_1,
      TOKEN_ACCOUNT_USDY_USDSTAR_POOL_2,
    ],
    tokenNames: ['USDY', 'USDstar'],
  },
  cfusd: {
    type: 'cfusd',
    tokenAccounts: [
      TOKEN_ACCOUNT_CFUSD_USDSTAR_POOL_1,
      TOKEN_ACCOUNT_CFUSD_USDSTAR_POOL_2,
    ],
    tokenNames: ['cfUSD', 'USDstar'],
  },
};
