import Link from "next/link";
import { Challenge } from "@/database/entities/Challenge";

interface Props {
  challenges: Challenge[];
}

export default function Home(props: Props) {
  return (
    <div>
      <h1>Challenges</h1>
      {props.challenges.map((challenge) => (
        <div key={challenge.id}>
          <h2>{challenge.title}</h2>
          <h3>Autor: {challenge.author.name}</h3>
          {
            challenge.tags.map((tag) => (
              <span key={tag.id}>{tag.name}</span>
            ))
          }
          <p>{challenge.description}</p>
          <Link href={`/challenges/${challenge.id}`}>
            Ver más
          </Link>
        </div>
      ))}
    </div>
  );
}


export async function getServerSideProps() {
  const res = await fetch(`${process.env.APP_HOST}/api/v1/challenge`);
  const challenges = await res.json();

  return {
    props: {
      challenges,
    },
  };
}
