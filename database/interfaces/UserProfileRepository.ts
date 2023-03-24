export interface UserProfileRepository<T> {
  findByUsername(username: string): Promise<T>;

  findById(id: string): Promise<T>;

  create(newUserProfile: T): Promise<T>;
}
