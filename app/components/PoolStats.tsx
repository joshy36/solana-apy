import React from 'react';
import { usePoolStats } from '../hooks/usePoolStats';
import { RefreshCw } from 'lucide-react';

export default function PoolStats() {
  const { balances, isLoading, error, refetch } = usePoolStats();

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-xl bg-red-50">
        Error loading stats: {error.message}
      </div>
    );
  }

  const totalUSD = Object.values(balances).reduce(
    (sum, balance) => sum! + (balance ?? 0),
    0
  );

  const getPercentage = (balance: number | null) => {
    if (balance === null || totalUSD === 0) return 0;
    return (balance / totalUSD!) * 100;
  };

  return (
    <div className="p-6 ">
      <div className="rounded-xl border bg-white shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold tracking-tight">
            USD* Seed Pool
          </h2>
          <button
            onClick={refetch}
            disabled={isLoading}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-primary-foreground shadow h-9 w-9 rounded-xl bg-[hsl(267,88.9%,54.1%)] hover:bg-[hsl(267,88.9%,54.1%)/90]"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {['USDC', 'USDT', 'PYUSD'].map((token) => (
            <div key={token} className="rounded-xl bg-white border p-4">
              <div className="text-sm text-gray-600">{token} Balance</div>
              <div className="mt-1 flex items-center gap-3">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-32 rounded-xl"></div>
                ) : (
                  <>
                    <div className="text-2xl font-semibold">
                      {balances[token] === null
                        ? '–'
                        : `${balances[token]?.toLocaleString()} ${token}`}
                    </div>
                    {balances[token] !== null && (
                      <div className="text-gray-500">
                        ({getPercentage(balances[token]).toFixed(1)}%)
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          <div className="border-t pt-4 mt-6">
            <div className="rounded-xl bg-white border p-4">
              <div className="text-sm text-gray-600">Total Value Locked</div>
              <div className="mt-1">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-32 rounded-xl"></div>
                ) : (
                  <div className="text-2xl font-semibold">
                    ${totalUSD?.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
