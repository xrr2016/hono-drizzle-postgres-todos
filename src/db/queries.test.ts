import { describe, it, expect, beforeEach, mock, afterEach } from "bun:test";
import { insertTodo, getTodosByUserId, NewTodo } from "./queries";
import {
  createTestDb,
  destoryTestDb,
  TestDbContext,
} from "../test/setup-test-db";

let ctx: TestDbContext;

beforeEach(async () => {
  ctx = await createTestDb();

  await mock.module("../db/db.ts", () => ({
    db: ctx.db,
  }));
});

afterEach(async () => {
  await destoryTestDb(ctx);
});

describe("insertTodo", () => {
  it("should insert a new todo", async () => {
    const newTodo = {
      userId: "a97842d1-6f70-4e88-164c-f04a3e475fa7",
      title: "test todo",
      completed: false,
      description: "no need",
    } as NewTodo;

    const todo = await insertTodo(newTodo);

    expect(todo.id).toBeDefined();
    expect(todo.title).toBe(newTodo.title);
    expect(todo.userId).toBe(newTodo.userId);
  });
});
