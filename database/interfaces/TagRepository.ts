export interface TagRepository<T> {
  findAll(): Promise<T[]>;

  findByChallengeId(challengeId: string): Promise<T[]>;
}
