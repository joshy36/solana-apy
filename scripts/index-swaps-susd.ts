import { Connection, PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const sleep = promisify(setTimeout);

function convertToUSD(amount: bigint): number {
  return Math.round(Number(amount) / 10000) / 100;
}

function convertBlockTimeToDateTime(blockTime: number): string {
  const date = new Date(blockTime * 1000);
  return (
    date
      .toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(',', 'T') + 'Z'
  );
}

async function decodeSwapData(programData: string) {
  try {
    const buffer = Buffer.from(
      programData.split('Program data: ')[1],
      'base64'
    );
    const amount1 = buffer.readBigUInt64LE(8);
    const amount2 = buffer.readBigUInt64LE(16);

    const usdAmount1 = convertToUSD(amount1);
    const usdAmount2 = convertToUSD(amount2);

    return { usdAmount1, usdAmount2 };
  } catch (error) {
    console.error('Error decoding swap data:', error);
    return null;
  }
}

async function storeTransaction(
  tx: any,
  operation: string
): Promise<string | null> {
  try {
    const transactionDate = convertBlockTimeToDateTime(tx.blockTime);

    const { data: transaction, error } = await supabase
      .from('susd_transactions')
      .insert({
        signature: tx.transaction.signatures[0],
        block_time: tx.blockTime,
        date: transactionDate,
        slot: tx.slot,
        fee: tx.meta.fee,
        operation: operation,
      })
      .select('id')
      .single();

    if (error) throw error;

    return transaction.id;
  } catch (error) {
    console.error('Error storing transaction:', error);
    return null;
  }
}

async function storeSwap(
  transactionId: string,
  amountIn: number,
  amountOut: number
) {
  try {
    const { error } = await supabase.from('susd_swaps').insert({
      transaction_id: transactionId,
      amount_in: amountIn,
      amount_out: amountOut,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error storing swap:', error);
  }
}

async function getSignaturesBatch(
  connection: Connection,
  address: PublicKey,
  beforeSignature?: string,
  limit: number = 1000
) {
  try {
    const options: any = { limit };
    if (beforeSignature) {
      options.before = beforeSignature;
    }

    return await connection.getSignaturesForAddress(address, options);
  } catch (error) {
    console.error('Error fetching signatures batch:', error);
    return [];
  }
}

async function processTransactions(
  connection: Connection,
  poolAddress: string,
  targetSignatures: number = 30000
): Promise<number> {
  console.log(`Fetching transactions for pool: ${poolAddress}`);

  const address = new PublicKey(poolAddress);
  let dailyVolume = 0;
  let processedSignatures = 0;
  let lastSignature: string | undefined;
  let allSignatures: any[] = [];

  try {
    while (allSignatures.length < targetSignatures) {
      if (allSignatures.length > 0) {
        await sleep(1000);
      }

      const signatures = await getSignaturesBatch(
        connection,
        address,
        lastSignature
      );

      if (signatures.length === 0) {
        console.log('No more signatures available');
        break;
      }

      allSignatures = allSignatures.concat(signatures);
      lastSignature = signatures[signatures.length - 1].signature;

      console.log(`Fetched ${allSignatures.length} signatures so far...`);
    }

    console.log(`Total signatures fetched: ${allSignatures.length}`);

    for (const sig of allSignatures) {
      if (processedSignatures > 0 && processedSignatures % 10 === 0) {
        await sleep(1000);
      }

      let operationType = '';

      const tx = await connection.getParsedTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0,
      });

      const messages = tx?.meta?.logMessages || [];
      for (let i = 0; i < messages.length - 1; i++) {
        const currentMessage = messages[i];
        const nextMessage = messages[i + 1];

        if (currentMessage.includes('Instruction: ')) {
          operationType = currentMessage.split('Instruction: ')[1];
        }

        if (
          (currentMessage.includes('SwapExactIn') ||
            currentMessage.includes('SwapExactOut')) &&
          nextMessage.includes('Program data: ')
        ) {
          const amounts = await decodeSwapData(nextMessage);
          if (amounts) {
            console.log(
              `\nProcessing transaction: ${sig.signature.slice(
                0,
                5
              )} | Operation: ${operationType}`
            );
            console.log('Swap Amounts:');
            console.log(`- Amount In: $${amounts.usdAmount1.toFixed(2)}`);
            console.log(`- Amount Out: $${amounts.usdAmount2.toFixed(2)}`);

            const transactionId = await storeTransaction(tx, operationType);
            if (transactionId) {
              await storeSwap(
                transactionId,
                amounts.usdAmount1,
                amounts.usdAmount2
              );
            }

            dailyVolume += amounts.usdAmount1;
          }
          i++;
        } else if (
          currentMessage.includes('AddLiquidity') ||
          currentMessage.includes('RemoveLiquidity')
        ) {
          console.log(
            `\nProcessing transaction: ${sig.signature.slice(
              0,
              5
            )} | Operation: ${operationType}`
          );
          await storeTransaction(tx, operationType);
        }
      }

      processedSignatures++;
    }

    console.log(`\nTotal Volume: $${dailyVolume.toFixed(2)}`);
    console.log(`Processed ${processedSignatures} signatures`);
    return dailyVolume;
  } catch (error) {
    console.error('Error in processTransactions:', error);
    return 0;
  }
}

async function main() {
  const poolAddress = '4FxWowiGfd8oseveAdXYafzc3fczKda9zi65oj6jqbtL';
  const connection = new Connection(process.env.NEXT_PUBLIC_QUICKNODE_RPC_URL!);

  await processTransactions(connection, poolAddress);
}

main().catch(console.error);
