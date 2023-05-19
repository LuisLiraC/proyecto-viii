export type ErrorMessage = {
  message: string,
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
