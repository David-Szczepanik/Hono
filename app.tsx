import { Hono } from "hono";
import bookRouter from "./routes/books.ts";
import { logger } from "hono/logger";
import Top from "./page.tsx";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

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

const route = app.post(
  "/posts",
  zValidator(
    "json",
    z.object({
      body: z.string(),
    })
  ),
  (c) => {
    return c.json({ hello: "world" });
  }
);

app.get("/stream", (c) => {
  return c.streamText(async (stream) => {
    for (let i = 0; i < 10; i++) {
      await stream.writeln(`Hello ${i}`); // Write a text with a new line ('\n')
      await stream.sleep(1000); // Wait 1 second
    }
  });
});

app.get("/", (c) => {
  const messages = ["Good Morning", "Good Evening", "Good Night"];
  return c.html(<Top messages={messages} />);
});

export default app;
