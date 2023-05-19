import { ChallengeDetail, SolutionDetail } from "@/utils/types";
import Link from "next/link";
import Head from "next/head";

type ProfileData = {
  challenges: ChallengeDetail[];
  solutions: SolutionDetail[];
}

export default function Profile({ username, profileData }: { username: string, profileData: ProfileData }) {
  const title = `Perfil de ${username} | Open Dev Projects`;
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>Perfil de {username}</h1>
      <div className="Profile-ContributionsContainer">
        <div className="Profile-ContributionColumn">
          <h2 className="Profile-ColumnTitle">Soluciones subidas</h2>
          <div>
            {
              profileData.solutions.map((solution) => (
                <div key={solution.id} className="ContributionCard">
                  <p className="ContributionDescription">{solution.description}</p>
                  <div className="TagsContainer">
                    {
                      solution.tags?.map((tag) => (
                        <span key={tag.id} className="Tag">{tag.name}</span>
                      ))
                    }
                  </div>
                  <div className="ButtonsContainer">
                    <Link
                      href={`/solutions/${solution.id}`}
                      className="ButtonLink"
                    >
                      Detalle de la solución
                    </Link>
                    <Link
                      href={`/challenges/${solution.challenge_id}`}
                      className="ButtonLink-Outline"
                    >
                      Ver reto
                    </Link>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="Profile-ContributionColumn">
          <h2 className="Profile-ColumnTitle">Retos creados</h2>
          <div>
            {
              profileData.challenges.map((challenge) => (
                <div key={challenge.id} className="ContributionCard">
                  <p className="ContributionTitle">{challenge.title}</p>
                  <div className="TagsContainer">
                    {
                      challenge.tags.map((tag) => (
                        <span key={tag.id} className="Tag">{tag.name}</span>
                      ))
                    }
                  </div>
                  <p className="ContributionDescription">{challenge.description}</p>
                  <Link
                    href={`/challenges/${challenge.id}`}
                    className="ButtonLink"
                  >
                    Ver reto
                  </Link>
                </div>
              ))
            }
          </div>
        </div>

      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { username } = context.query;
  const publicProfile = await fetch(`${process.env.APP_HOST}/api/v1/profile/${username}`);

  const profileData = await publicProfile.json();

  return {
    props: {
      username,
      profileData
    },
  };
}


