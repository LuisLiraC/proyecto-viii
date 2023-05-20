import { useState } from "react";
import { useRouter } from "next/router";
import { Tag } from "@/utils/types";
import Head from "next/head";

function NewChallenge({ currentTags }: { currentTags: Tag[] }) {
  const [tags, setTags] = useState<String[]>([]);
  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const title = e.target.title.value.trim();
    const description = e.target.description.value.trim();

    if (!title || !description) {
      alert("Por favor, rellena todos los campos");
      return;
    }

    const newChallenge = {
      title,
      description,
      tags,
    };

    const res = await fetch('/api/v1/challenge', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newChallenge),
    });

    const data = await res.json();

    if (!data.id) {
      alert("Error al crear el reto");
      return;
    }

    await router.push(`/challenges/${data.id}`);
  };

  const handleTags = (e: any) => {
    const tag = e.target.value;
    if (tags.includes(tag)) {
      const newTags = tags.filter((t) => t !== tag);
      setTags(newTags);
    } else {
      setTags([...tags, tag]);
    }
  };

  return (
    <div>
      <Head>
        <title>Crear reto | Open Dev Projects</title>
      </Head>
      <h1 className="NewChallengeTitle">Crear reto</h1>
      <form onSubmit={handleSubmit}>
        <div className='FormElement'>
          <label htmlFor="title">Título</label>
          <input
            type="text"
            name="title"
            id="title"
          />
        </div>

        <div className='FormElement'>
          <label htmlFor="description">Descripción</label>
          <textarea
            name="description"
            id="description"
            cols={30}
            rows={15}
          ></textarea>
        </div>

        <div className="FormElement">
          <label htmlFor="tags">Etiquetas</label>
          <div className="TagsForm">
            {currentTags.map((tag) => (
              <div key={tag.id} className="TagForm">
                <input
                  type="checkbox"
                  name="tag"
                  id={`${tag.name}`}
                  value={tag.name}
                  onChange={handleTags}
                />
                <label htmlFor={`${tag.name}`}>{tag.name}</label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="SubmitButton">Subir reto</button>
      </form>
    </div>
  );
}

export default NewChallenge;


export async function getServerSideProps() {
  const data = await fetch(`${process.env.APP_HOST}/api/v1/tag`);
  const currentTags = await data.json();

  return {
    props: {
      currentTags
    },
  };
}
