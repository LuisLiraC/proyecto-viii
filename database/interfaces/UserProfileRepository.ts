export interface UserProfileRepository<T> {
  findByUsername(username: string): Promise<T>;

  findByID(id: string): Promise<T>;
}
