import { Task } from "../features/tasks/task.types";

// Função para data local (igual você já fez)
function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

export const tasks: Task[] = [
  // 🔵 HOJE
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
  {
    id: "3",
    location: "Mercado ABC",
    quantity: 25,
    date: today,
    type: "entrega",
    status: "pendente",
  },

  // 🟡 AMANHÃ
  {
    id: "4",
    location: "Mercado Central",
    quantity: 10,
    date: tomorrow,
    type: "entrega",
    status: "pendente",
  },
  {
    id: "5",
    location: "Posto Energia",
    quantity: 0,
    date: tomorrow,
    type: "manutencao",
    status: "pendente",
  },

  // 🟣 PRÓXIMOS (curto prazo)
  {
    id: "6",
    location: "Mercado Norte",
    quantity: 50,
    date: nextDays,
    type: "entrega",
    status: "pendente",
  },
  {
    id: "7",
    location: "Loja Tech",
    quantity: 0,
    date: nextDays,
    type: "manutencao",
    status: "concluido",
  },

  // 🔴 PRÓXIMOS (longo prazo)
  {
    id: "8",
    location: "Distribuidora Max",
    quantity: 80,
    date: future,
    type: "entrega",
    status: "pendente",
  },
  {
    id: "9",
    location: "Supermercado Bom Preço",
    quantity: 0,
    date: future,
    type: "manutencao",
    status: "pendente",
  },
   {
    id: "10",
    location: "Distribuidora Max",
    quantity: 80,
    date: future,
    type: "entrega",
    status: "pendente",
  },
   {
    id: "12",
    location: "Distribuidora Max",
    quantity: 80,
    date: future,
    type: "entrega",
    status: "pendente",
  },
   {
    id: "13",
    location: "Distribuidora Max",
    quantity: 80,
    date: future,
    type: "entrega",
    status: "pendente",
  },
];