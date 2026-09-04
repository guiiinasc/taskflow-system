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
const allowedOrigins = [
  "https://taskflow-syst.vercel.app",
  "http://localhost:3000",
  ...(process.env.FRONTEND_URL?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? []),
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allowed?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origem não permitida pelo CORS"));
  },
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