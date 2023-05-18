import { ChallengeDetail } from "@/utils/types";

function challengeDetail({ challenge }: { challenge: ChallengeDetail }) {
  return (
    <div>
      <h1>{challenge.title}</h1>
      <h2>Autor: {challenge.author.name}</h2>
      {
        challenge.tags.map((tag) => (
          <span key={tag.id}>{tag.name}</span>
        ))
      }
      <p>{challenge.description}</p>
    </div>
  );
}

export default challengeDetail;

export async function getServerSideProps(context: any) {
  const { challengeId } = context.query;
  const data = await fetch(`${process.env.APP_HOST}/api/v1/challenge/${challengeId}`);
  const challenge = await data.json();

  return {
    props: {
      challenge
    },
  };
}
