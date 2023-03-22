export interface AuthUserRepository<T> {
  findByEmail(email: string): Promise<T>;

  create(newUser: T): Promise<T>;
}
