import { UserProfile } from "@/database/entities/UserProfile";

export type Solution = {
  id: string;
  description: string;
  url: string;
  challenge_id: string;
  created_at: string;
  updated_at: string;
  author: UserProfile;
}
