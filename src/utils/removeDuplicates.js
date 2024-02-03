// arrayUtils.js

const removeDuplicates = (array, property) => {
    const filter = array.filter((obj, index, self) =>
      index === self.findIndex((o) => o[property] === obj[property])
    );
  
    return filter;
  };

  export default removeDuplicates;
  