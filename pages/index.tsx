import Link from "next/link";
import { Challenge } from "@/database/entities/Challenge";

interface Props {
  challenges: Challenge[];
}

export default function Home(props: Props) {
  return (
    <div>
      <h1>Retos encontrados</h1>
      {props.challenges.map((challenge) => (
        <div key={challenge.id} className='ChallengeHomeCard'>
          <h2 className='ChallengeHomeCard-Title'>{challenge.title}</h2>
          <h3 className='ChallengeHomeCard-Author'>Autor: {challenge.author.name}</h3>
          <div className='TagsContainer'>
            {
              challenge.tags.map((tag) => (
                <span key={tag.id} className='Tag'>{tag.name}</span>
              ))
            }
          </div>
          <p className='ChallengeHomeCard-Description'>{challenge.description}</p>
          <Link
            href={`/challenges/${challenge.id}`}
            className='ChallengeHomeCard-Link'
          >
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
