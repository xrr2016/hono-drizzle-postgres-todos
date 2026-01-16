import * as schema from "../src/db/schema";
import { reset, seed } from "drizzle-seed";
import { db, pool } from "../src/db/db";

export async function seedDb() {
  await reset(db, schema);

  await seed(db, schema).refine((funcs) => ({
    usersTable: {
      columns: {
        age: funcs.int({ minValue: 0, maxValue: 150 }),
      },
      count: 10,
      with: {
        todosTable: 10,
      },
    },
    todosTable: {
      columns: {
        title: funcs.valuesFromArray({
          values: [
            "Buy groceries",
            "Do laundry",
            "Clean room",
            "Walk the dog",
            "Cook dinner",
            "Code for work",
            "Read a book",
            "Go for a walk",
            "Go to the gym",
          ],
        }),
        description: funcs.valuesFromArray({
          values: [
            "Very important",
            "Not so important",
            "Could be done",
            "Not important at all",
            "Could be done",
            "Not important at all",
          ],
        }),
      },
      count: 10,
    },
  }));
}

seedDb()
  .then(() => {
    console.log("Database seeded");
    return pool.end();
  })
  .catch((err) => {
    console.error("Error seeding database:", err);
    return pool.end();
  });
