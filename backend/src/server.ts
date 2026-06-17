import app from "./app";
import authRoutes from "./modules/auth/auth.routes";
import tasksRoutes from "./modules/tasks/tasks.routes";

app.use("/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(` Server rodando na porta ${PORT}`);
});