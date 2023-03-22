import { Role } from "@/database/entities/Role";

export type UserProfile = {
  id: string;
  auth_user_id: string;
  name: string;
  username: string;
  created_at: string;
  updated_at: string;
  role: Role;
}
