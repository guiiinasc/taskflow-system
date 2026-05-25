import { Task } from "../features/tasks/task.types";

export const tasks: Task[] = [
  {
    id: "1",
    location: "Mercado Silva",
    quantity: 20,
    date: new Date().toISOString().split("T")[0],
    type: "entrega",
    status: "pendente",
  },
  {
    id: "2",
    location: "Mercado XPTO",
    quantity: 15,
    date: new Date().toISOString().split("T")[0],
    type: "manutencao",
    status: "concluido",
  },
];