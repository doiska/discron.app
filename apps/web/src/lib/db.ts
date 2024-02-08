import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from "./env";

const client = postgres(env.DATABASE_URL);
export const kil = drizzle(client, {
    logger: true
});

