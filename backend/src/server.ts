import app from "./app";
import authRoutes from "./modules/auth/auth.routes";

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(` Server rodando na porta ${PORT}`);
});