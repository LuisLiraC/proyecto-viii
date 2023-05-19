export type ErrorMessage = {
  message: string,
}

export type Role = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}


export type UserProfile = {
  id: string;
  auth_user_id: string;
  name: string;
  username: string;
  created_at: string;
  updated_at: string;
  role: Role;
}

export type JwtPayload = {
  id: string;
  role: string;
  iam: string;
  exp: number;
  username: string;
}

export type UserNameAvailability = {
  is_available: boolean;
}

export type Author = {
  username: string;
  name: string;
}

export type Tag = {
  id: string;
  name: string;
}
export type ChallengeDetail = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  author: Author,
  tags: Tag[];
}

export type SolutionDetail = {
  id: string;
  description: string;
  url: string;
  created_at: string;
  author: Author;
  tags: Tag[];
  challenge_id: string;
  challenge_title?: string;
}

export type Challenge = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  author: UserProfile
  tags: Array<Tag>;
}

export type Solution = {
  id: string;
  description: string;
  url: string;
  challenge_id: string;
  created_at: string;
  updated_at: string;
  author: UserProfile;
}

export type PublicProfile = {
  challenges: Challenge[];
  solutions: Solution[];
}

export type Comment = {
  id: string;
  content: string;
  created_at: string;
  author: Author;
}
