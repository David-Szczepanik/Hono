import { Hono } from "hono";
import bookRouter from "./routes/books";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", logger());

console.log("Hello via Bun!");

// Bun.serve({
//     fetch: (request) => {
//         return new Response("Hello via Bun!");
//     },
//     port: process.env.PORT || 3000,
// })

app.get("/hello", (c) => {
  return c.json({ hello: "world" });
});

app.route("/book", bookRouter);

app.get("/stream", (c) => {
  return c.streamText(async (stream) => {
    for (let i = 0; i < 10; i++) {
      await stream.writeln(`Hello ${i}`); // Write a text with a new line ('\n')
      await stream.sleep(1000); // Wait 1 second
    }
  });
});

Bun.serve({
  fetch: app.fetch,
  port: process.env.PORT || 3000,
});
