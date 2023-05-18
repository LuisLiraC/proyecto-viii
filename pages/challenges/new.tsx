import { useState } from "react";
import { useRouter } from "next/router";
import { Tag } from "@/utils/types";

function NewChallenge({ currentTags }: { currentTags: Tag[] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<String[]>([]);
  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
      <h1>Crear reto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value.trim())}
          />
        </div>

        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            name="description"
            id="description"
            cols={30}
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value.trim())}
          ></textarea>
        </div>

        <div>
          <label htmlFor="tags">Tags</label>
          {currentTags.map((tag) => (
            <div key={tag.id}>
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

        <button type="submit">Subir reto</button>
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
