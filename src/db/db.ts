import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const pool = new Pool({
  max: 10,
  idleTimeoutMillis: 30000,
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({ client: pool, casing: "snake_case" });
