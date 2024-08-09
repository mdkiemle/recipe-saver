import {ReactElement, useContext, useEffect, useState} from "react";
import { RecipeContext } from "../context/RecipeContext";
import { getRequest } from "../messaging/send";
import { IdName } from "../models/generic";
import { Card } from "./Card";
import { Button } from "@headlessui/react";
import { FaLink } from "react-icons/fa";

const RecipeLinks = (): ReactElement | undefined => {
  const {recipe: {id}, isEditing} = useContext(RecipeContext);
  const [links, setLinks] = useState<IdName[]>([]) // Links are just ids from associated recipes (number[]?)
  const [loading, setLoading] = useState(false);
  const [showing, setShowing] = useState(false);

  const handleShowRecipeLink = (): void => setShowing(true);
  
  useEffect(() => {
    setLoading(true);
    getRequest<IdName[], number>("get-recipe-links", "get-recipe-links-return", id).then(res => {
      setLoading(false);
      console.log("what this", res);
      setLinks(res);
    }).catch(err => console.log("Error returning links: ", err));
  }, []);

  useEffect(() => {
    if (!isEditing && !loading && links.length === 0) setShowing(false);
  }, [isEditing, loading]);

  console.log("what is happening", showing);

  if (loading && links.length === 0) {
    return <Card>
      Getting links to other recipes...
    </Card>
  }
  if (!loading && links.length === 0 && !isEditing) return undefined;
  if (!loading && links.length === 0 && isEditing && !showing) {
    return <Button className="btn-primary self-start" onClick={handleShowRecipeLink}>
      <FaLink /> Add Recipe Links
    </Button>
  }
    return (
    <Card>
      <h2 className="text-xl mb-4">Recipe Links</h2>
      {links.map(link => <span key={link.id}>{link.name}</span>)}
      {isEditing && <Button><FaLink /> Add Recipe Link</Button>}
    </Card>
  );
}

export {RecipeLinks};
