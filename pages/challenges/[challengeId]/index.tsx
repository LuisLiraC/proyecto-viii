import { ChallengeDetail } from "@/utils/types";
import { useRouter } from "next/router";
import Head from "next/head";

function ChallengeDetail({ challenge }: { challenge: ChallengeDetail }) {

  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newSolution = {
      url: e.target.url.value,
      description: e.target.description.value,
      challenge_id: challenge.id,
    };

    const res = await fetch('/api/v1/solution', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSolution),
    });

    const data = await res.json();

    if (!data.id) {
      alert("Error al crear la solución");
      return;
    }

    await router.push(`/solutions/${data.id}`);
  };

  return (
    <div className="ChallengeDetail-View">
      <Head>
        <title>{challenge.title} | Open Dev Projects</title>
      </Head>
      <div className="ChallengeDetail">
        <h1 className="ChallengeDetail-Title">{challenge.title}</h1>
        <h2 className="ChallengeDetail-Author">Autor: {challenge.author.name}</h2>
        <div className="TagsContainer">
          {
            challenge.tags.map((tag) => (
              <span key={tag.id} className='Tag'>{tag.name}</span>
            ))
          }
        </div>
        <p className="ChallengeDetail-Description">{challenge.description}</p>
      </div>

      <div className="SolutionIntent">
        <p className="SolutionIntent-Message">¿Tienes una solución para este reto? Súbela aquí</p>
        <form onSubmit={handleSubmit} className='SolutionForm'>
          <div className="FormElement">
            <label htmlFor="url">URL de la solución</label>
            <input type="text" name="url" id="url"/>
          </div>
          <div className="FormElement">
            <label htmlFor="description">Descripción</label>
            <textarea name="description" id="description" cols={30} rows={10}></textarea>
          </div>
          <button type="submit" className='SubmitButton'>Subir solución</button>
        </form>
      </div>
    </div>
  );
}

export default ChallengeDetail;

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
