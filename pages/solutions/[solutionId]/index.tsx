import { useRouter } from "next/router";
import { Author } from "@/utils/types";

type SolutionDetail = {
  id: string;
  description: string;
  url: string;
  created_at: string;
  author: Author;
}

type Comment = {
  id: string;
  content: string;
  created_at: string;
  author: Author;
}

function ChallengeDetail({ solution, comments }: { solution: SolutionDetail, comments: Comment[] }) {

  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newComment = {
      content: e.target.content.value,
      solution_id: solution.id,
    };

    const res = await fetch('/api/v1/comment', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });

    const data = await res.json();

    if (!data.id) {
      alert("Error al crear el comentario");
      return;
    }

    await router.push(`/solutions/${solution.id}`);
  };

  return (
    <div>
      <div>
        <h1>Solución de {solution.author.name}</h1>
        <a href={solution.url} target="_blank" rel="noreferrer">Ver solución</a>
        <p>{solution.description}</p>
      </div>

      <div>
        <h2>Comentarios</h2>
        {
          comments.map((comment) => (
            <div key={comment.id}>
              <h3>{comment.author.name}</h3>
              <p>{comment.content}</p>
            </div>
          ))
        }
      </div>

      <div onSubmit={handleSubmit}>
        <form>
          <div>
            <label htmlFor="content">Comentario</label>
            <textarea name="content" id="content" cols={30} rows={10}></textarea>
          </div>
          <button type="submit">Comentar</button>
        </form>
      </div>
    </div>
  );
}

export default ChallengeDetail;

export async function getServerSideProps(context: any) {
  const { solutionId } = context.query;
  const solutionResponse = await fetch(`${process.env.APP_HOST}/api/v1/solution/${solutionId}`);
  const solution = await solutionResponse.json();

  const commentsResponse = await fetch(`${process.env.APP_HOST}/api/v1/solution/${solutionId}/comments`);
  const comments = await commentsResponse.json();

  return {
    props: {
      solution,
      comments,
    },
  };
}
