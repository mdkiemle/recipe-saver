import {ReactElement, useContext, useEffect, useState} from "react";
import { RecipeContext } from "../context/RecipeContext";
import { getRequest } from "../messaging/send";
import { IdName } from "../models/generic";
import { Card } from "./Card";

const RecipeLinks = (): ReactElement | undefined => {
  const {recipe: {id}, isEditing} = useContext(RecipeContext);
  const [links, setLinks] = useState<IdName[]>([]) // Links are just ids from associated recipes (number[]?)
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    getRequest<IdName[], number>("get-links", "get-links-return", id).then(res => {
      setLoading(false);
      setLinks(res);
    }).catch(err => console.log("Error returning links: ", err));
  }, []);

  if (loading && links.length === 0) {
    return <Card>
      Getting links to other recipes...
    </Card>
  }
  if (links.length >= 1) {
      return (
      <Card>
        hi
      </Card>
    );
  }
  return undefined;
};

export {RecipeLinks};
