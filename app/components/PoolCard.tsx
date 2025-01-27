import React, { useState } from 'react';
import { PoolStats } from '../hooks/usePoolStats';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';

export type PoolCardProps = {
  title: string;
  tokens: Array<{ symbol: string; logo: string }>;
  stats: PoolStats | undefined;
  seedPoolApr: number | undefined;
  isLoading: boolean;
  isFetching: boolean;
  slider: boolean;
};

export function PoolCard({
  title,
  tokens,
  stats,
  seedPoolApr,
  isLoading,
  slider,
}: PoolCardProps) {
  const [value, setValue] = useState<number[]>([50]);

  const getPercentage = (balance: number, tvl: number) => {
    if (!tvl) return 0;
    return (balance / tvl) * 100;
  };

  const displaySymbol = (symbol: string) => {
    return symbol === 'USDstar' ? 'USD*' : symbol;
  };

  const ValueSkeleton = () => (
    <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
  );

  const PercentageSkeleton = () => (
    <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
  );

  return (
    <div className="rounded-xl border bg-white h-full">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>

      <div className="p-6 space-y-4">
        {tokens.map(({ symbol, logo }) => (
          <div key={symbol} className="p-2">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Image src={logo} alt={`${symbol} logo`} className="w-5 h-5" />
              {displaySymbol(symbol)}
            </div>
            <div className="mt-1 flex items-center gap-3 min-h-[32px]">
              <div className="text-xl min-w-[128px]">
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
                  {getPercentage(stats.balances[symbol], stats.tvl).toFixed(2)}%
                </div>
              )}
              {isLoading && <PercentageSkeleton />}
            </div>
          </div>
        ))}

        <div className="border-t pt-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2">
              <div className="text-sm text-gray-600">TVL</div>
              <div className="mt-1">
                <div className="text-xl">
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
              <div className="text-sm text-gray-600">24h Volume</div>
              <div className="mt-1">
                <div className="text-xl">
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
              <div className="text-sm text-gray-600">Volume/TVL</div>
              <div className="mt-1">
                <div className="text-xl">
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
              <div className="text-sm text-gray-600">APR</div>
              <div className="mt-1">
                <div className="text-xl">
                  {isLoading ? (
                    <ValueSkeleton />
                  ) : slider ? (
                    seedPoolApr ? (
                      `${(
                        (Number(seedPoolApr) * value[0]) / 100 +
                        Number(stats?.apr ?? 0)
                      ).toFixed(2)}%`
                    ) : (
                      '–'
                    )
                  ) : seedPoolApr ? (
                    `${seedPoolApr}%`
                  ) : (
                    '–'
                  )}
                </div>
              </div>
            </div>
            {slider && (
              <div className="col-span-2 py-6 px-4">
                <div className="mb-2 text-sm text-gray-600 flex justify-between">
                  <span>sUSD LP Share</span>
                  <span>{value[0]}%</span>
                </div>
                <Slider
                  defaultValue={value}
                  max={100}
                  step={1}
                  onValueChange={(value) => setValue(value)}
                />
                <div className="text-center mt-2 text-sm text-gray-600">
                  <span className="font-mono">
                    Base APR: {isLoading ? '–' : stats?.apr ?? 0}% + (Seed APR:{' '}
                    {isLoading ? '–' : seedPoolApr ?? 0}% ×{' '}
                    {(value[0] / 100).toFixed(2)})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
