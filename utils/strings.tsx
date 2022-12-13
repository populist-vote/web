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

function getContrasting(hexcolor: string) {
  // Remove any whitespace
  hexcolor = hexcolor.replace(/\s/g, "");
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === "#") {
    hexcolor = hexcolor.slice(1);
  }

  // If a three-character hexcode, make six-character
  if (hexcolor.length === 3) {
    hexcolor = hexcolor
      .split("")
      .map((hex: string) => hex + hex)
      .join("");
  }

  // Convert to RGB value
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);

  // Get YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Check contrast
  return yiq >= 128 ? "var(--grey-darkest)" : "var(--white)";
}

export { titleCase, kebabCase, addAlphaToHexColor, getContrasting };
