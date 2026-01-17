import { db } from "./db";
import { todosTable, usersTable } from "./schema";
import { eq, desc } from "drizzle-orm";
import type { UUID } from "crypto";

export type NewTodo = {
  userId: UUID;
  title: string;
  completed?: boolean;
  description?: string;
};

export async function insterUser(email: string, password: string) {
  const passwordHash = await Bun.password.hash(password);
  const [user] = await db
    .insert(usersTable)
    .values({
      email,
      passwordHash,
    })
    .returning();

  return user.id as UUID;
}

export async function insertTodo(todo: NewTodo) {
  const [result] = await db.insert(todosTable).values(todo).returning();

  return result;
}

export async function getTodosByUserId(userId: UUID) {
  const todos = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.userId, userId))
    .orderBy(desc(todosTable.createdAt));

  return todos;
}
