import { UserProfile } from "@/database/entities/UserProfile";
import { Tag } from "@/database/entities/Tag";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  author: UserProfile
  tags: Array<Tag>;
}
