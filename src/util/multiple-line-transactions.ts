import {Ingredient} from "../models/recipe";

export const buildIngredientList = (ingredients: Ingredient[], groupId: number): string => {
  const values = ingredients.map(ing => `insert into ingredient (item, measurement, ingredientGroupId) values ("${ing.item}", "${ing.measurement}", "${groupId}");`);

  const statement = `
    BEGIN TRANSACTION;
    ${values.join(" ")}
    COMMIT;
  `;

  console.log("statement: ", statement);
  return statement;
};

export const buildFolders = (folderIds: number[], recipeId: number): string => {
  const values = folderIds.map(id => `insert into folderRecipe (recipeId, folderId) values ("${recipeId}", "${id}");`);

  const statement = `
    BEGIN TRANSACTION;
    ${values.join(" ")}
    COMMIT;
  `
  return statement;
};