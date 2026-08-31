import app from "./app";
import authRoutes from "./modules/auth/auth.routes";
import holidaysRoutes from "./modules/holidays/holidays.routes";
import tasksRoutes from "./modules/tasks/tasks.routes";

const PORT = process.env.PORT || 3333;

app.use("/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/holidays", holidaysRoutes);
app.use("/holidays", holidaysRoutes);

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});