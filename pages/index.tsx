import Head from 'next/head';
import { useState, useEffect } from "react";
import { Challenge, Tag } from "@/utils/types";
import Filters from "@/components/Filters";
import Results from "@/components/Results";

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

  const handleFilterTags = (e: any) => {
    const tag = e.target.value;
    if (tags.includes(tag)) {
      const newTags = tags.filter((t) => t !== tag);
      setTags(newTags);
    } else {
      setTags([...tags, tag]);
    }
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

  return (
    <div className="Home">
      <Head>
        <title>Home | Open Dev Projects</title>
      </Head>

      <Filters
        tags={props.tags}
        handleFilterInput={handleFilterInput}
        handleFilterTags={handleFilterTags}
      />

      <Results challenges={challenges}/>
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
