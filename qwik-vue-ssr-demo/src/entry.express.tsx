import render from "./entry.ssr";
import express from "express";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import "dotenv/config";

const distDir = join(fileURLToPath(import.meta.url), "..", "..", "dist");
const buildDir = join(distDir, "build");
const assetsDir = join(distDir, "assets");
const PORT = process.env.PORT ?? 3000;

const app = express();

// Serve static assets
app.use(`/build`, express.static(buildDir, { immutable: true, maxAge: "1y" }));
app.use(`/assets`, express.static(assetsDir, { immutable: true, maxAge: "1y" }));
app.use(express.static(distDir, { redirect: false }));

// Fallback to render the Qwik app
app.all("*", async (req, res, next) => {
  try {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    await render({
      stream: res,
      base: "/build/",
      serverData: {
        req,
        res,
      },
    });
    res.end();
  } catch (err) {
    next(err);
  }
});

app.listen(PORT as number, "127.0.0.1", () => {
  console.log(`Server started: http://localhost:${PORT}/`);
});
