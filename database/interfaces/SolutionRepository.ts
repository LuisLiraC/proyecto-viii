import { Solution } from "@/database/entities/Solution";

export interface SolutionRepository {
  findByChallengeId(challengeId: string): Promise<Solution[]>;

  findById(id: string): Promise<Solution>;

  create(newSolution: Solution, userId: string): Promise<Solution>;

  verifyUserAlreadySubmittedSolution(challengeId: string, userId: string): Promise<boolean>;
}
