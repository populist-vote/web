function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function kebabCase(str: string): string {
  return str.toLowerCase().split(" ").join("-");
}

function splitAtDigitAndJoin(str: string): string {
  return str.split(/(\d.*)/, 2).join(" ");
}

export { titleCase, kebabCase, splitAtDigitAndJoin };
