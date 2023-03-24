import { UserProfile } from "@/database/entities/UserProfile";

export type Comment = {
  id: string,
  content: string,
  solution_id: string,
  author: UserProfile
  created_at: string,
  updated_at: string,
}
