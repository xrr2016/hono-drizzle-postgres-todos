import { Hono } from "hono";
import type { UUID } from "crypto";
import { getTodosByUserId } from "./db/queries";

const app = new Hono();

app.get("/todos", async (c) => {
  const userId = c.req.query("userId");

  if (!userId) {
    return c.json({ error: "userId is required" }, 400);
  }

  try {
    const todos = await getTodosByUserId(userId as UUID);
    return c.json(todos, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
