import type { Task } from "../features/tasks/task.types";
import { toLocalDateString } from "../utils/date";

const nowIso = toLocalDateString(new Date());

const todayDate = new Date();
const tomorrowDate = new Date();
tomorrowDate.setDate(todayDate.getDate() + 1);

const nextWeekDate = new Date();
nextWeekDate.setDate(todayDate.getDate() + 3);

const futureDate = new Date();
futureDate.setDate(todayDate.getDate() + 7);

const today = toLocalDateString(todayDate);
const tomorrow = toLocalDateString(tomorrowDate);
const nextDays = toLocalDateString(nextWeekDate);
const future = toLocalDateString(futureDate);

function seedTask(task: Omit<Task, "createdAt" | "updatedAt" | "userId">): Task {
  return {
    ...task,
    userId: "local-user",
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export const tasks: Task[] = [
  seedTask({
    id: "1",
    title: "Entrega de mercadorias",
    location: "Mercado Silva",
    quantity: 20,
    date: today,
    type: "entrega",
    status: "pendente",
  }),
  seedTask({
    id: "2",
    title: "Manutenção de freezer",
    location: "Mercado XPTO",
    quantity: 15,
    date: today,
    type: "manutencao",
    status: "concluido",
  }),
  seedTask({
    id: "3",
    title: "Reabastecimento urgente",
    location: "Mercado ABC",
    quantity: 25,
    date: today,
    type: "entrega",
    status: "pendente",
  }),
  seedTask({
    id: "4",
    title: "Entrega de perecíveis",
    location: "Mercado Central",
    quantity: 10,
    date: tomorrow,
    type: "entrega",
    status: "pendente",
  }),
  seedTask({
    id: "5",
    title: "Checklist de manutenção",
    location: "Posto Energia",
    date: tomorrow,
    type: "manutencao",
    status: "pendente",
  }),
  seedTask({
    id: "6",
    title: "Entrega de cesta básica",
    location: "Mercado Norte",
    quantity: 50,
    date: nextDays,
    type: "entrega",
    status: "pendente",
  }),
  seedTask({
    id: "7",
    title: "Reparo de sistema elétrico",
    location: "Loja Tech",
    date: nextDays,
    type: "manutencao",
    status: "concluido",
  }),
  seedTask({
    id: "8",
    title: "Entrega em grande volume",
    location: "Distribuidora Max",
    quantity: 80,
    date: future,
    type: "entrega",
    status: "pendente",
  }),
  seedTask({
    id: "9",
    title: "Manutenção preventiva",
    location: "Supermercado Bom Preço",
    date: future,
    type: "manutencao",
    status: "pendente",
  }),
  seedTask({
    id: "10",
    title: "Entrega volumosa",
    location: "Distribuidora Max",
    quantity: 80,
    date: future,
    type: "entrega",
    status: "pendente",
  }),
  seedTask({
    id: "12",
    title: "Entrega para loja regional",
    location: "Distribuidora Max",
    quantity: 80,
    date: future,
    type: "entrega",
    status: "pendente",
  }),
  seedTask({
    id: "13",
    title: "Inspeção de manutenção",
    location: "Distribuidora Max",
    quantity: 80,
    date: future,
    type: "entrega",
    status: "pendente",
  }),
];
