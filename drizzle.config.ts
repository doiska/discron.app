import type { Config } from "drizzle-kit";

const config: Config = {
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    },
    schema: ["./apps/shared/schemas/**/*.ts"]
}

export default config;
