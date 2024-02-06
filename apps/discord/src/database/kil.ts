import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from "../app/env.ts";

const client = postgres(env.DATABASE_URL);
export const kil = drizzle(client);

