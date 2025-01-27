import React from 'react';
import { usePoolStats } from '../hooks/usePoolStats';
import { PoolCard } from './PoolCard';

export default function PoolStats() {
  const { data, isLoading, isFetching } = usePoolStats();

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6 justify-center items-stretch">
      <div className="w-full md:w-[500px]">
        <PoolCard
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
          slider={false}
        />
      </div>

      <div className="w-full md:w-[500px]">
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
          slider={true}
        />
      </div>
    </div>
  );
}
