export interface ChallengeRepository<T> {
  findAll(): Promise<T[]>;

  findByID(id: string): Promise<T>;

  create(newChallenge: T, userId: string): Promise<T>;
}
