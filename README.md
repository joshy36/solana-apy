This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Generate Types

`supabase gen types typescript --project-id dicobstovuazzxpvbpbi --schema public > types/database.types.ts`

## Index Swaps

`npm run script scripts/index-swaps.ts <poolAddress> <poolName>`

## Future Improvements

- Right now we are calculating the APR based on data collected over a 24 hour window which can become stale
- Would be better to ingest realtime data and calculate the APR over a rolling 24 window 
- Could also calculate APR from a 7 day window
- Include historical APR and pool TVL graphs