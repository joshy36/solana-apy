import React from 'react';
import { PoolStats } from '../hooks/usePoolStats';
import Image from 'next/image';
import { Banknote, BarChart, DollarSign, Scale } from 'lucide-react';

export type SeedPoolCardProps = {
  title: string;
  tokens: Array<{ symbol: string; logo: string }>;
  stats: PoolStats | undefined;
  seedPoolApr: number | undefined;
  isLoading: boolean;
  isFetching: boolean;
};

export function SeedPoolCard({
  title,
  tokens,
  stats,
  seedPoolApr,
  isLoading,
}: SeedPoolCardProps) {
  const displaySymbol = (symbol: string) => {
    return symbol === 'USDstar' ? 'USD*' : symbol;
  };

  const ValueSkeleton = () => (
    <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
  );

  const PercentageSkeleton = () => (
    <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
  );

  const getPercentage = (balance: number, tvl: number) => {
    if (!tvl) return 0;
    return (balance / tvl) * 100;
  };

  return (
    <div className="rounded-xl border bg-white">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>

      <div className="flex flex-col lg:flex-row p-6 justify-between">
        <div className="flex flex-col gap-4">
          {tokens.map(({ symbol, logo }) => (
            <div key={symbol} className="p-2">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Image
                  src={logo}
                  alt={`${symbol} logo`}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                {displaySymbol(symbol)}
              </div>
              <div className="mt-1 flex items-center gap-3 min-h-[32px]">
                <div className="text-lg min-w-[128px]">
                  {isLoading ? (
                    <ValueSkeleton />
                  ) : !stats?.balances[symbol] ? (
                    '–'
                  ) : (
                    `$${stats.balances[symbol].toLocaleString()}`
                  )}
                </div>
                {!isLoading && stats?.balances[symbol] && (
                  <div className="text-gray-500 text-xs min-w-[48px]">
                    {getPercentage(stats.balances[symbol], stats.tvl).toFixed(
                      2
                    )}
                    %
                  </div>
                )}
                {isLoading && <PercentageSkeleton />}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 lg:ml-8 self-center w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-8 mt-4 lg:mt-0">
          <div className="p-2">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Banknote className="w-4 h-4" />
              TVL
            </div>
            <div className="mt-1">
              <div className="text-lg">
                {isLoading ? (
                  <ValueSkeleton />
                ) : stats?.tvl ? (
                  `$${stats.tvl.toLocaleString()}`
                ) : (
                  '–'
                )}
              </div>
            </div>
          </div>

          <div className="p-2">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              24h Volume
            </div>
            <div className="mt-1">
              <div className="text-lg">
                {isLoading ? (
                  <ValueSkeleton />
                ) : stats?.volume24h ? (
                  `$${stats.volume24h.toLocaleString()}`
                ) : (
                  '–'
                )}
              </div>
            </div>
          </div>

          <div className="p-2">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Volume/TVL
            </div>
            <div className="mt-1">
              <div className="text-lg">
                {isLoading ? (
                  <ValueSkeleton />
                ) : stats?.volume24h && stats?.tvl ? (
                  (stats.volume24h / stats.tvl).toFixed(2)
                ) : (
                  '–'
                )}
              </div>
            </div>
          </div>

          <div className="p-2">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              APR
            </div>
            <div className="mt-1">
              <div className="text-lg">
                {isLoading ? (
                  <ValueSkeleton />
                ) : seedPoolApr ? (
                  `${seedPoolApr}%`
                ) : (
                  '–'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
