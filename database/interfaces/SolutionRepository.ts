import { Solution } from "@/database/entities/Solution";

export interface SolutionRepository {
  findByChallengeId(challengeId: string): Promise<Solution[]>;
}
