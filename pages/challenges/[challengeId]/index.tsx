import { ChallengeDetail } from "@/utils/types";
import { useRouter } from "next/router";

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
    <div>
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
      <div onSubmit={handleSubmit}>
        <p>¿Tienes una solución para este reto? Súbela aquí</p>
        <form>
          <div>
            <label htmlFor="url">URL de la solución</label>
            <input type="text" name="url" id="url"/>
          </div>
          <div>
            <label htmlFor="description">Descripción</label>
            <textarea name="description" id="description" cols={30} rows={10}></textarea>
          </div>
          <button type="submit">Subir solución</button>
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
