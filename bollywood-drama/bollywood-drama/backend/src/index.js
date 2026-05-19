import express from "express";
import cors from "cors";
import { scriptRouter } from "./routes/script.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { rateLimiter } from "./middleware/rateLimiter.middleware.js";

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(rateLimiter);

app.use("/api/script", scriptRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🎬 Bollywood Drama Backend running on port ${PORT}`);
});
