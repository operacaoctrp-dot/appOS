export type UserRole = "admin" | "manutencao" | "visualizador";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  created_at: string;
}
