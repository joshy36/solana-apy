import React from 'react';
import { usePoolStats } from '../hooks/usePoolStats';
import { PoolCard } from './PoolCard';
import { SeedPoolCard } from './SeedPoolCard';

export default function PoolStats() {
  const { data, isLoading, isFetching } = usePoolStats();

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="w-full max-w-4xl mx-auto">
        <SeedPoolCard
          title="USD* Seed Pool"
          tokens={[
            { symbol: 'USDC', logo: '/usd-coin-usdc-logo.svg' },
            { symbol: 'USDT', logo: '/tether-usdt-logo.svg' },
            { symbol: 'PYUSD', logo: '/paypal-usd-pyusd-logo.svg' },
          ]}
          stats={data?.mainPool}
          seedPoolApr={data?.mainPool?.apr}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="w-full">
          <PoolCard
            title="sUSD-USD* Pool"
            tokens={[
              { symbol: 'sUSD', logo: '/solayer.png' },
              { symbol: 'USDstar', logo: '/perena.svg' },
            ]}
            stats={data?.susdPool}
            seedPoolApr={data?.mainPool?.apr}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        </div>

        <div className="w-full">
          <PoolCard
            title="USDS-USD* Pool"
            tokens={[
              { symbol: 'USDS', logo: '/usds-logo.svg' },
              { symbol: 'USDstar', logo: '/perena.svg' },
            ]}
            stats={data?.usdsPool}
            seedPoolApr={data?.mainPool?.apr}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        </div>

        <div className="w-full">
          <PoolCard
            title="USDY-USD* Pool"
            tokens={[
              { symbol: 'USDY', logo: '/usdy-logo.svg' },
              { symbol: 'USDstar', logo: '/perena.svg' },
            ]}
            stats={data?.usdyPool}
            seedPoolApr={data?.mainPool?.apr}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        </div>

        <div className="w-full">
          <PoolCard
            title="cfUSD-USD* Pool"
            tokens={[
              { symbol: 'cfUSD', logo: '/cfusd-logo.svg' },
              { symbol: 'USDstar', logo: '/perena.svg' },
            ]}
            stats={data?.cfusdPool}
            seedPoolApr={data?.mainPool?.apr}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        </div>
      </div>
    </div>
  );
}
