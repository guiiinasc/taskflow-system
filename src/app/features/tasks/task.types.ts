export type TaskStatus =
  | "pendente"
  | "em_andamento"
  | "concluido"
  | "cancelado";

export type TaskType = "entrega" | "manutencao";

export interface Task {
  id: string;
  location: string;
  quantity?: number; 
  description?: string; 
  date: string;
  time?: string;
  type: TaskType;
  status: TaskStatus;
}