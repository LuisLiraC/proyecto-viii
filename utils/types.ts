export type ErrorMessage = {
  message: string,
}


export type JwtPayload = {
  id: string;
  role: string;
  iam: string;
  exp: number;
}
