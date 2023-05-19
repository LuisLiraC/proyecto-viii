import Link from "next/link";
import Head from 'next/head';
import { Challenge } from "@/database/entities/Challenge";
import { useState, useEffect } from "react";
import { Tag } from "@/utils/types";

interface Props {
  challenges: Challenge[];
  tags: Tag[];
}

export default function Home(props: Props) {
  const [challenges, setChallenges] = useState(props.challenges);
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleFilterInput = (e: any) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    let filteredChallenges: Challenge[] = [];
    if (tags.length === 0 && query === '') {
      setChallenges(props.challenges);
      return;
    }

    filteredChallenges = props.challenges.filter((challenge) => {
      return challenge.title.toLowerCase().includes(query.toLowerCase());
    });

    if (tags.length > 0) {
      filteredChallenges = filteredChallenges.filter((challenge) => {
        return challenge.tags.some((tag) => tags.includes(tag.name));
      });
    }

    setChallenges(filteredChallenges);
  }, [tags, props.challenges, query]);

  const handleFilterTags = (e: any) => {
    const tag = e.target.value;
    if (tags.includes(tag)) {
      const newTags = tags.filter((t) => t !== tag);
      setTags(newTags);
    } else {
      setTags([...tags, tag]);
    }
  };

  return (
    <div className="Home">
      <Head>
        <title>Home | Open Dev Projects</title>
      </Head>
      <div className="Filters">
        <div className="FormElement">
          <label htmlFor="title" className="FilterTitle">Buscar</label>
          <input type={'text'} onChange={handleFilterInput}/>
        </div>
        <hr/>
        <div>
          <p className="FilterTitle">Etiquetas</p>

          <div className="TagsFilter">
            {props.tags.map((tag) => (
              <div key={tag.id} className="TagOption">
                <input
                  type="checkbox"
                  name="tag"
                  id={`${tag.name}`}
                  value={tag.name}
                  onChange={handleFilterTags}
                />
                <label htmlFor={`${tag.name}`}>{tag.name}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="Results">
        <h1>Retos encontrados</h1>
        {challenges.map((challenge) => (
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
    </div>
  );
}


export async function getServerSideProps() {
  const challengesResponse = await fetch(`${process.env.APP_HOST}/api/v1/challenge`);
  const challenges = await challengesResponse.json();

  const tagsResponse = await fetch(`${process.env.APP_HOST}/api/v1/tag`);
  const tags = await tagsResponse.json();

  return {
    props: {
      challenges,
      tags
    },
  };
}
