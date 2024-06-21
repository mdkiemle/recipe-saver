// Better typing coming soon
export const prettyRecipe = (tableReturn: any): any => {
  console.log("inside pretty", tableReturn);
  return tableReturn[0];
  /**
   * Want roughly to convert to this format:
   * Recipe {
   *  id
   *  name
   *  instructions
   *  notes
   *  folderId
   *  ingredientGroups: {
   *    id
   *    groupName
   *    ingredients: {
   *      id
   *      name
   *      measurement
   *    }
   *  }
   * }
   */

}