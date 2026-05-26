import { Task } from "../features/tasks/task.types";

// Mesma função utilitária — garante data local, não UTC
function toLocalDateString(date: Date): string {
  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day   = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const today = toLocalDateString(new Date());

export const tasks: Task[] = [
  {
    id: "1",
    location: "Mercado Silva",
    quantity: 20,
    date: today,
    type: "entrega",
    status: "pendente",
  },
  {
    id: "2",
    location: "Mercado XPTO",
    quantity: 15,
    date: today,
    type: "manutencao",
    status: "concluido",
  },
];