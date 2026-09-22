import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: ReturnType<typeof postgres> | undefined;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString)
    throw new Error(
      "DATABASE_URL belum diatur. Salin .env.example ke .env.local lalu isi kredensial Supabase.",
    );
  client ??= postgres(connectionString, { prepare: false, max: 5 });
  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof getDb>;
