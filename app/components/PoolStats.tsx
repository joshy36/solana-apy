import React from 'react';
import { RefreshCw } from 'lucide-react';
import { usePoolStats } from '../hooks/usePoolStats';

export default function PoolStats() {
  const { data, isLoading, refetch } = usePoolStats({
    tokenAddress: 'NUMERUNsFCP3kuNmWZuXtm1AaQCPj9uw6Guv2Ekoi5P',
  });

  const volume24h = data?.volume24h;
  const apr = data?.apr;
  const balances = data?.balances;
  const tvl = data?.tvl;

  const getPercentage = (balance: number | null) => {
    if (balance === null || !tvl || tvl === 0) return 0;
    return (balance / tvl) * 100;
  };

  return (
    <div className="p-6 w-1/2">
      <div className="rounded-xl border bg-white shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold tracking-tight">
            USD* Seed Pool
          </h2>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-gray-600 shadow h-9 w-9 rounded-xl bg-white hover:bg-gray-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {['USDC', 'USDT', 'PYUSD'].map((token) => (
            <div key={token} className="rounded-xl bg-white border p-4">
              <div className="text-sm text-gray-600">{token}</div>
              <div className="mt-1 flex items-center gap-3">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-32 rounded-xl"></div>
                ) : (
                  <>
                    <div className="text-2xl">
                      {!balances?.[token as keyof typeof balances]
                        ? '–'
                        : `$${balances[
                            token as keyof typeof balances
                          ].toLocaleString()}`}
                    </div>
                    {balances?.[token as keyof typeof balances] && (
                      <div className="text-gray-500">
                        (
                        {getPercentage(
                          balances[token as keyof typeof balances]
                        ).toFixed(1)}
                        %)
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          <div className="border-t pt-4 mt-6">
            <div className="rounded-xl bg-white border p-4">
              <div className="text-sm text-gray-600">TVL</div>
              <div className="mt-1">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-32 rounded-xl"></div>
                ) : (
                  <div className="text-2xl">${tvl?.toLocaleString()}</div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-white border p-4">
              <div className="text-sm text-gray-600">24h Volume</div>
              <div className="mt-1">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-32 rounded-xl"></div>
                ) : (
                  <div className="text-2xl">
                    ${volume24h?.toLocaleString() ?? '–'}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-white border p-4">
              <div className="text-sm text-gray-600">Volume/TVL</div>
              <div className="mt-1">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-32 rounded-xl"></div>
                ) : (
                  <div className="text-2xl">
                    {volume24h && tvl ? `${(volume24h / tvl).toFixed(2)}` : '–'}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-white border p-4">
              <div className="text-sm text-gray-600">APR</div>
              <div className="mt-1">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-32 rounded-xl"></div>
                ) : (
                  <div className="text-2xl">{apr ? `${apr}%` : '–'}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
