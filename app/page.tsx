'use client';

import PoolStats from './components/PoolStats';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F2EDFF]">
      <main className="container mx-auto px-4 py-8 flex justify-center">
        <PoolStats />
      </main>
    </div>
  );
}
