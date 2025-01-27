import { NextResponse } from 'next/server';
import {
  TOKEN_ACCOUNT_PYUSD,
  TOKEN_ACCOUNT_USDC,
  TOKEN_ACCOUNT_USDT,
  TOKEN_ACCOUNT_SUSD_USDSTAR_POOL_1,
  TOKEN_ACCOUNT_SUSD_USDSTAR_POOL_2,
} from '../../constants';
import { connection, supabase } from '@/lib/clients';

export async function GET() {
  try {
    const tokenBalances = await Promise.all([
      connection.getTokenAccountBalance(TOKEN_ACCOUNT_USDC),
      connection.getTokenAccountBalance(TOKEN_ACCOUNT_USDT),
      connection.getTokenAccountBalance(TOKEN_ACCOUNT_PYUSD),
      connection.getTokenAccountBalance(TOKEN_ACCOUNT_SUSD_USDSTAR_POOL_1),
      connection.getTokenAccountBalance(TOKEN_ACCOUNT_SUSD_USDSTAR_POOL_2),
    ]);

    const balances = {
      USDC: tokenBalances[0].value.uiAmount || 0,
      USDT: tokenBalances[1].value.uiAmount || 0,
      PYUSD: tokenBalances[2].value.uiAmount || 0,
    };

    const susdBalances = {
      sUSD: tokenBalances[3].value.uiAmount || 0,
      USDstar: tokenBalances[4].value.uiAmount || 0,
    };

    const poolTVL = Object.values(balances).reduce(
      (sum, balance) => sum + balance,
      0
    );

    const susdPoolTVL = Object.values(susdBalances).reduce(
      (sum, balance) => sum + balance,
      0
    );

    const [swapsData, susdSwapsData] = await Promise.all([
      supabase.from('swaps').select('total_volume:amount_in.sum()'),
      supabase.from('susd_swaps').select('total_volume:amount_in.sum()'),
    ]);

    if (swapsData.error || susdSwapsData.error) {
      return NextResponse.json(
        { error: swapsData.error?.message || susdSwapsData.error?.message },
        { status: 500 }
      );
    }

    const totalVolume = swapsData.data?.[0]?.total_volume || 0;
    const susdTotalVolume = susdSwapsData.data?.[0]?.total_volume || 0;
    const feePercentage = 0.0001;

    const apr = ((totalVolume * feePercentage * 365) / poolTVL) * 100;
    const susdApr =
      ((susdTotalVolume * feePercentage * 365) / susdPoolTVL) * 100;

    return NextResponse.json({
      mainPool: {
        apr: apr.toFixed(2),
        volume24h: totalVolume,
        tvl: poolTVL,
        balances,
      },
      susdPool: {
        apr: susdApr.toFixed(2),
        volume24h: susdTotalVolume,
        tvl: susdPoolTVL,
        balances: susdBalances,
      },
    });
  } catch (error: unknown) {
    console.error('APR calculation failed:', error);
    return NextResponse.json(
      { error: 'Failed to calculate APR' },
      { status: 500 }
    );
  }
}
