import { NextResponse } from 'next/server';
import {
  TOKEN_ACCOUNT_PYUSD,
  TOKEN_ACCOUNT_USDC,
  TOKEN_ACCOUNT_USDT,
} from '../../constants';
import { connection, supabase } from '@/lib/clients';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const poolName = searchParams.get('pool');
    console.log('[APR API] Request received for pool:', poolName);

    if (!poolName) {
      console.log('[APR API] Error: No pool name provided');
      return NextResponse.json(
        { error: 'Pool name is required' },
        { status: 400 }
      );
    }

    if (poolName !== 'seed') {
      console.log('[APR API] Error: Invalid pool name:', poolName);
      return NextResponse.json(
        { error: 'Invalid pool name. Only "seed" pool is supported.' },
        { status: 400 }
      );
    }

    console.log('[APR API] Fetching token balances...');
    const tokenBalances = await Promise.all([
      connection.getTokenAccountBalance(TOKEN_ACCOUNT_USDC),
      connection.getTokenAccountBalance(TOKEN_ACCOUNT_USDT),
      connection.getTokenAccountBalance(TOKEN_ACCOUNT_PYUSD),
    ]);

    const balances = {
      USDC: tokenBalances[0].value.uiAmount || 0,
      USDT: tokenBalances[1].value.uiAmount || 0,
      PYUSD: tokenBalances[2].value.uiAmount || 0,
    };

    const poolTVL = Object.values(balances).reduce(
      (sum, balance) => sum + balance,
      0
    );
    console.log('[APR API] Token balances:', balances);
    console.log('[APR API] Pool TVL:', poolTVL);

    console.log('[APR API] Querying Supabase for total volume...');
    const { data, error } = await supabase
      .from('swaps')
      .select('total_volume:amount_in.sum()');

    if (error) {
      console.error('[APR API] Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalVolume = data?.[0]?.total_volume || 0;
    const feePercentage = 0.0001;
    const apr = ((totalVolume * feePercentage * 365) / poolTVL) * 100;

    console.log('[APR API] Calculated APR:', {
      totalVolume,
      feePercentage,
      poolTVL,
      apr,
    });

    return NextResponse.json({
      pool: poolName,
      apr: apr.toFixed(2),
      volume24h: totalVolume,
      tvl: poolTVL,
      balances,
    });
  } catch (error) {
    console.error('[APR API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate APR' },
      { status: 500 }
    );
  }
}
