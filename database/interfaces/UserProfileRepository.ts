export interface UserProfileRepository<T> {
  findByUsername(username: string): Promise<T>;
}
