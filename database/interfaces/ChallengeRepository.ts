export interface ChallengeRepository<T> {
  findAll(): Promise<T[]>;

  findById(id: string): Promise<T>;

  create(newChallenge: T, userId: string): Promise<T>;
}
