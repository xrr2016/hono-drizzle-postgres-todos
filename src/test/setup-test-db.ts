import { Pool } from "pg";
import { randomUUID } from "crypto";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "../db/schema";
import { join } from "path";

export type TestDbContext = {
  pool: Pool;
  dbName: string;
  db: NodePgDatabase<typeof schema>;
};

const adminDbUrl = process.env.ADMIN_DB_URL;

export async function createTestDb(): Promise<TestDbContext> {
  const testDbName = `test_db_${randomUUID().replace(/-/g, "")}`;
  const testDbUrl = `postgresql://user:password@localhost:5432/${testDbName}`;

  const adminPool = new Pool({
    connectionString: adminDbUrl,
  });
  await adminPool.query(`CREATE DATABASE ${testDbName}`);
  await adminPool.end();

  const pool = new Pool({
    connectionString: testDbUrl,
    max: 10,
    idleTimeoutMillis: 30000,
  });
  const db = drizzle({
    client: pool,
    schema: schema,
    casing: "snake_case",
  });
  await migrate(db, { migrationsFolder: join(__dirname, "../db/drizzle") });

  return {
    pool,
    db,
    dbName: testDbName,
  };
}

export async function destoryTestDb({ pool, dbName }: TestDbContext) {
  await pool.end();
  const adminPool = new Pool({
    connectionString: adminDbUrl,
  });

  await adminPool.query(
    `
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1 AND pid <> pg_backend_pid();
    `,
    [dbName]
  );
  await adminPool.query(`DROP DATABASE IF EXISTS ${dbName}`);
  await adminPool.end();
}
