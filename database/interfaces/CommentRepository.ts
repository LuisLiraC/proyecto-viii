export interface CommentRepository<T> {
  findBySolutionId(solutionId: string): Promise<T[]>;
}
