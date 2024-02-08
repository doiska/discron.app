import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
    },
    emptyStringAsUndefined: true,
    runtimeEnv: process.env
});

console.log(env.DATABASE_URL);
