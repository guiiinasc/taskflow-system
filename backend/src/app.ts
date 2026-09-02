import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./modules/auth/auth.routes";
import holidaysRoutes from "./modules/holidays/holidays.routes";
import tasksRoutes from "./modules/tasks/tasks.routes";

dotenv.config();

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(
  cors(corsOptions)
);

app.options(/(.*)/, cors(corsOptions));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/holidays", holidaysRoutes);
app.use("/holidays", holidaysRoutes);

app.get("/", (req, res) => {
  res.send("API rodando");
});

export default app;