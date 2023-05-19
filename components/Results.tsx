import Link from "next/link";
import { Challenge } from "@/utils/types";

interface Props {
  challenges: Challenge[];
}

function Results(props: Props) {
  return (
    <div className="Results">
      <h1>Retos encontrados</h1>
      {props.challenges.map((challenge) => (
        <div key={challenge.id} className='ChallengeHomeCard'>
          <h2 className='ChallengeHomeCard-Title'>
            {challenge.title}
          </h2>
          <h3 className='ChallengeHomeCard-Author'>
            Autor: {challenge.author.name}
          </h3>
          <div className='TagsContainer'>
            {
              challenge.tags.map((tag) => (
                <span key={tag.id} className='Tag'>{tag.name}</span>
              ))
            }
          </div>
          <p className='ChallengeHomeCard-Description'>
            {challenge.description}
          </p>
          <Link
            href={`/challenges/${challenge.id}`}
            className='ButtonLink'
          >
            Ver más
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Results;
