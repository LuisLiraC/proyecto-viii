export interface CommentRepository<T> {
  findBySolutionId(solutionId: string): Promise<T[]>;

  create(newComment: T, userId: string): Promise<T>;
}
