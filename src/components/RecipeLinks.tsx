import {ReactElement, useContext, useEffect, useState} from "react";
import { RecipeContext } from "../context/RecipeContext";
import { getRequest } from "../messaging/send";
import { Card } from "./Card";
import { Button } from "@headlessui/react";
import { FaLink } from "react-icons/fa";
import { useMount } from "../hooks/useMount";
import { RecipeLink } from "../models/recipe";
import { Link } from "react-router-dom";

export interface RecipeLinksProps {
  openModal: () => void;
}

const RecipeLinks = ({openModal}: RecipeLinksProps): ReactElement | undefined => {
  const {recipe: {id, recipeLinks}, isEditing, dispatch} = useContext(RecipeContext);
  const [loading, setLoading] = useState(false);
  const [showing, setShowing] = useState(false);

  const handleShowRecipeLink = (): void => setShowing(true);
  
  useMount(() => {
    setLoading(true);
    getRequest<RecipeLink[], number>("get-recipe-links", "get-recipe-links-return", id).then(res => {
      dispatch({type: "ADD_LINKS", payload: res});
      setLoading(false);
    }).catch(err => console.log("Error returning links: ", err));
  });

  useEffect(() => {
    if (!isEditing && !loading && recipeLinks.length === 0) setShowing(false);
  }, [isEditing, loading]);

  if (loading && recipeLinks.length === 0) {
    return <Card>
      Getting links to other recipes...
    </Card>
  }
  if (!loading && recipeLinks.length === 0 && !isEditing) return undefined;
  if (!loading && recipeLinks.length === 0 && isEditing && !showing) {
    return <Button className="btn-primary self-start" onClick={handleShowRecipeLink}>
      <FaLink /> Add Recipe Links
    </Button>
  }
    return (
    <Card>
      <h2 className="text-xl mb-4">Recipe Links</h2>
      <div className="flex flex-col gap-2">
        {recipeLinks.map(link => link.label ?
          <span className="w-auto" key={link.id}>{link.label}: <Link to={`/recipe/${link.id}`} className="link">{link.name}</Link></span>
          : <Link key={link.id} to={`/recipe/${link.id}`} className="link w-auto">{link.name}</Link>)}
      </div>
      {isEditing && <Button className="btn-primary" onClick={openModal}><FaLink /> Add Recipe Link</Button>}
    </Card>
  );
};

export {RecipeLinks};
