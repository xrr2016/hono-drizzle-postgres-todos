import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  boolean,
  check,
} from "drizzle-orm/pg-core";

const timestamps = {
  deletedAt: timestamp({ withTimezone: true }),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
};

export const usersTable = pgTable(
  "users",
  {
    ...timestamps,
    age: integer(),
    id: uuid().primaryKey().defaultRandom(),
    passwordHash: varchar({ length: 256 }).notNull(),
    email: varchar({ length: 256 }).unique().notNull(),
  },
  (table) => [
    check("age_1", sql`${table.age} >= 0`),
    check("age_2", sql`${table.age} <= 150`),
  ]
);

export const todosTable = pgTable("todos", {
  ...timestamps,
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  title: varchar({ length: 500 }).notNull(),
  description: varchar({ length: 1000 }),
  completed: boolean().default(false),
});
