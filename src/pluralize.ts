// Our needs aren't very sophisticated, and neither is this function.
export default (word: string) => {
  if (word === "stadium") {
    return "stadia";
  }
  return `${word}s`;
};
