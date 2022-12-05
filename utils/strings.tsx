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

// https://stackoverflow.com/questions/50890241/programmatically-add-opacity-to-a-color-in-typescript
function addAlphaToHexColor(color: string, opacity: number): string {
  // coerce values so ti is between 0 and 1.
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}

export { titleCase, kebabCase, addAlphaToHexColor };
