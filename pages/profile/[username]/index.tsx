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
      <div>
        <h2>Soluciones subidas</h2>
        {
          profileData.solutions.map((solution) => (
            <div key={solution.id}>
              <p>{solution.description}</p>
              <a href={solution.url} target="_blank" rel="noreferrer">Ver solución</a>
            </div>
          ))
        }
      </div>
      <div>
        <h2>Retos creados</h2>
        {
          profileData.challenges.map((challenge) => (
            <div key={challenge.id}>
              <p>{challenge.title}</p>
              <p>{challenge.tags.map((tag) => tag.name).join(", ")}</p>
              <p>{challenge.description}</p>
              <Link href={`/challenges/${challenge.id}`}>
                Ver reto
              </Link>
            </div>
          ))
        }
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


