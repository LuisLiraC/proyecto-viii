export interface AuthUserRepository<T> {
  findByEmail(email: string): Promise<T>;
}
