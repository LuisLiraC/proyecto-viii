import { useRouter } from "next/router";
import { SolutionDetail, Comment } from "@/utils/types";
import Head from "next/head";

function ChallengeDetail({ solution, comments }: { solution: SolutionDetail, comments: Comment[] }) {

  console.log(solution);

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

  const title = `Solución de ${solution.author.name} | Open Dev Projects`;

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1 className="SolutionDetail-ChallengeTitle">
          Solución a: {solution.challenge_title || '❓ Reto eliminado'}
        </h1>
        <h2 className="SolutionDetail-Author">
          Autor: {solution.author.name}
        </h2>
        <a
          href={solution.url}
          target="_blank"
          rel="noreferrer"
          className="ButtonLink"
        >
          Ver solución
        </a>
        <p className="SolutionDetail-Description">
          {solution.description}
        </p>
      </div>

      <hr/>

      <div>
        <h2>Comentarios</h2>
        <div className="CommentsContainer">
          {
            comments.map((comment) => (
              <div key={comment.id} className="Comment">
                <h3 className="Comment-Author">
                  {comment.author.name}
                </h3>
                <p className="Comment-Content">
                  {comment.content}
                </p>
              </div>
            ))
          }
        </div>
      </div>

      <hr/>

      <div>
        <form onSubmit={handleSubmit}>
          <div className="FormElement">
            <textarea name="content" id="content" cols={30} rows={3}></textarea>
          </div>
          <button className="SubmitButton" type="submit">Comentar</button>
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
