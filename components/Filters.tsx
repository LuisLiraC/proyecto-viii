import { Tag } from "@/utils/types";

interface Props {
  tags: Tag[];
  handleFilterInput: (e: any) => void;
  handleFilterTags: (e: any) => void;
}

function Filters(props: Props) {
  return (
    <div className="Filters">
      <div className="FormElement">
        <label htmlFor="title" className="FilterTitle">Buscar</label>
        <input type={'text'} onChange={props.handleFilterInput}/>
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
                onChange={props.handleFilterTags}
              />
              <label htmlFor={`${tag.name}`}>{tag.name}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Filters;
