import { db } from "./db";
import { todosTable } from "./schema";
import { eq, desc } from "drizzle-orm";
import type { UUID } from "crypto";

type NewTodo = {
  userId: UUID;
  title: string;
  completed?: boolean;
  description?: string;
};

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
