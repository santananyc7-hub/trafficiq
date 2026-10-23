/**
 * Command-Center data source. Reads the latest aggregate snapshot from Neon
 * when DATABASE_URL is set; otherwise falls back to the committed JSON so the
 * app renders before Neon is wired. The weekly cron calls writeSnapshot().
 *
 * Only ZIP-level aggregates (no PII) are ever stored.
 */
import { neon } from "@neondatabase/serverless";

export interface Snapshot {
  active: number;
  repeatRate: number;
  realLTV: number;
  avgTxns: number;
  channel: Record<string, number>;
  rows: Array<{
    zip: string; name: string; lat: number; lng: number; pop: number; match: number;
    status: string; activeY: number; dormant: number; penetration: number;
    ["reactivate$"]: number; ["capture$"]: number; annual: number;
  }>;
  updatedAt: string | null;
}

const CREATE = "CREATE TABLE IF NOT EXISTS command_snapshot (id text PRIMARY KEY, data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())";

// The Vercel Neon integration may expose the pooled URL under any of these.
function dbUrl(): string | undefined {
  return (process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL_UNPOOLED)?.trim() || undefined;
}

export async function writeSnapshot(payload: Omit<Snapshot, "updatedAt">): Promise<void> {
  const url = dbUrl();
  if (!url) throw new Error("No database URL set");
  const sql = neon(url);
  await sql.query(CREATE);
  await sql`INSERT INTO command_snapshot (id, data, updated_at)
    VALUES ('latest', ${JSON.stringify(payload)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
}

export async function getSnapshot(): Promise<Snapshot> {
  const url = dbUrl();
  if (url) {
    try {
      const sql = neon(url);
      await sql.query(CREATE);
      const rows = (await sql`SELECT data, updated_at FROM command_snapshot WHERE id = 'latest'`) as Array<{ data: Omit<Snapshot, "updatedAt">; updated_at: string }>;
      if (rows[0]) return { ...rows[0].data, updatedAt: rows[0].updated_at };
    } catch {
      /* fall through to committed JSON */
    }
  }
  const fallback = (await import("../../data/out/opportunity_year.json")).default as unknown as Omit<Snapshot, "updatedAt">;
  return { ...fallback, updatedAt: null };
}
