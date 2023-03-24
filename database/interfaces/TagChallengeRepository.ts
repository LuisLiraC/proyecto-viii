export interface TagChallengeRepository<T> {
  create(newTagChallenge: T): Promise<T>;
}
