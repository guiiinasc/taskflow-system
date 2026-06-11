import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// 🌍 CORS
app.use(
  cors({
    origin: "http://localhost:3000", // frontend
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando 🔥");
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});