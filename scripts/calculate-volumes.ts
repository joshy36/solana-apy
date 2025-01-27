import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

type PoolType = 'main' | 'susd' | 'cfusd' | 'usds' | 'usdy';

type SwapsTable =
  | 'swaps'
  | 'susd_swaps'
  | 'cfusd_swaps'
  | 'usds_swaps'
  | 'usdy_swaps';
type TransactionsTable =
  | 'transactions'
  | 'susd_transactions'
  | 'cfusd_transactions'
  | 'usds_transactions'
  | 'usdy_transactions';

interface PoolConfig {
  swapsTable: SwapsTable;
  transactionsTable: TransactionsTable;
}

const POOL_CONFIGS: Record<PoolType, PoolConfig> = {
  main: { swapsTable: 'swaps', transactionsTable: 'transactions' },
  susd: { swapsTable: 'susd_swaps', transactionsTable: 'susd_transactions' },
  cfusd: { swapsTable: 'cfusd_swaps', transactionsTable: 'cfusd_transactions' },
  usds: { swapsTable: 'usds_swaps', transactionsTable: 'usds_transactions' },
  usdy: { swapsTable: 'usdy_swaps', transactionsTable: 'usdy_transactions' },
} as const;

async function fetch24HourVolume(
  poolConfig: PoolConfig,
  startDate: string,
  endDate: string
): Promise<number> {
  console.log(
    `Fetching 24h volume for ${poolConfig.swapsTable} from ${startDate} to ${endDate}`
  );

  let totalVolume = 0;
  let page = 0;
  const limit = 1000;
  let hasMore = true;

  while (hasMore) {
    console.log(`Fetching page ${page} for ${poolConfig.swapsTable}`);
    const { data: swaps, error } = await supabase
      .from(poolConfig.swapsTable)
      .select(`amount_in, ${poolConfig.transactionsTable}!inner(date)`)
      .gte(`${poolConfig.transactionsTable}.date`, startDate)
      .lte(`${poolConfig.transactionsTable}.date`, endDate)
      .range(page * limit, (page + 1) * limit - 1);

    if (error) throw error;

    if (swaps.length === 0) {
      hasMore = false;
    } else {
      const pageVolume = swaps.reduce((sum, swap) => sum + swap.amount_in, 0);
      totalVolume += pageVolume;
      page++;
    }
  }

  return totalVolume;
}

async function getLatestDate(
  transactionsTable: TransactionsTable
): Promise<Date> {
  const { data, error } = await supabase
    .from(transactionsTable)
    .select('date')
    .order('date', { ascending: false })
    .limit(1);

  if (error) throw error;
  return new Date(data[0].date!);
}

async function calculatePoolVolume(poolType: PoolType): Promise<{
  volume: number;
  start_date: string;
  end_date: string;
  pool_type: PoolType;
  calculated_at: string;
}> {
  const poolConfig = POOL_CONFIGS[poolType];
  const endDate = await getLatestDate(poolConfig.transactionsTable);
  const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);

  const volume = await fetch24HourVolume(
    poolConfig,
    startDate.toISOString(),
    endDate.toISOString()
  );

  return {
    pool_type: poolType,
    volume,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    calculated_at: new Date().toISOString(),
  };
}

async function main() {
  try {
    const poolTypes = Object.keys(POOL_CONFIGS) as PoolType[];
    const volumeResults = await Promise.all(poolTypes.map(calculatePoolVolume));

    const { error } = await supabase.from('volumes').upsert(volumeResults, {
      onConflict: 'pool_type',
    });

    if (error) {
      throw error;
    }

    console.log('Volumes calculated and updated successfully');
  } catch (error) {
    console.error('Error calculating volumes:', error);
    throw error;
  }
}

main().catch(console.error);
