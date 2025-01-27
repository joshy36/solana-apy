import { NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import { connection, supabase } from '@/lib/clients';
import {
  POOLS,
  FEE_PERCENTAGE,
  DAYS_IN_YEAR,
  PoolData,
} from '../../types/backend';

async function getPoolBalances(tokenAccounts: PublicKey[]): Promise<number[]> {
  const balances = await Promise.all(
    tokenAccounts.map((account) => connection.getTokenAccountBalance(account))
  );
  return balances.map((balance) => balance.value.uiAmount || 0);
}

function calculateTVL(balances: number[]): number {
  return balances.reduce((sum, balance) => sum + balance, 0);
}

function calculateAPR(volume: number, tvl: number): string {
  const apr = ((volume * FEE_PERCENTAGE * DAYS_IN_YEAR) / tvl) * 100;
  return apr.toFixed(2);
}

export async function GET() {
  try {
    const { data: volumes, error: volumesError } = await supabase
      .from('volumes')
      .select('*')
      .order('calculated_at', { ascending: false })
      .limit(5);

    if (volumesError) throw volumesError;

    const poolsData: Record<string, PoolData> = {};

    for (const [poolKey, poolConfig] of Object.entries(POOLS)) {
      const volume =
        volumes.find((v) => v.pool_type === poolConfig.type)?.volume || 0;
      const balanceValues = await getPoolBalances(poolConfig.tokenAccounts);

      const balances = Object.fromEntries(
        poolConfig.tokenNames.map((name, index) => [name, balanceValues[index]])
      );

      const tvl = calculateTVL(balanceValues);
      const apr = calculateAPR(volume, tvl);

      poolsData[`${poolKey}Pool`] = {
        apr,
        volume24h: volume,
        tvl,
        balances,
      };
    }

    return NextResponse.json(poolsData);
  } catch (error: unknown) {
    console.error('APR calculation failed:', error);
    return NextResponse.json(
      { error: 'Failed to calculate APR' },
      { status: 500 }
    );
  }
}
