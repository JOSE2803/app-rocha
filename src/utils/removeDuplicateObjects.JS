const removeDuplicateObjects = async (array, property) => {

  const filter = await array.filter((obj, index, self) =>
    index === self.findIndex((o) => o[property] === obj[property]));

  return filter;

};

export default removeDuplicateObjects;
