import { Connection } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const connection = new Connection(
  process.env.NEXT_PUBLIC_QUICKNODE_RPC_URL!
);
