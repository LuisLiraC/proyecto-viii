import { UserProfile } from "@/database/entities/UserProfile";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  author: UserProfile
}
