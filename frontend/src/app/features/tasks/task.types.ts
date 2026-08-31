export type TaskStatus =
  | "pendente"
  | "em_andamento"
  | "concluido"
  | "cancelado";

export type TaskType = "entrega" | "manutencao" | "outro";

export interface Task {
  id: string;
  userId: string;
  title: string;
  location: string;
  quantity?: number;
  description?: string;
  customType?: string;
  date: string;
  time?: string;
  type: TaskType;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}