/** Decodes common HTML character references in plain text (e.g. title strings from crawlers). */
function decodeHtmlEntities(text: string): string {
  const fromCodePointSafe = (n: number) => {
    if (n > 0x10ffff || n < 0) {
      return "\ufffd";
    }
    try {
      return String.fromCodePoint(n);
    } catch {
      return "\ufffd";
    }
  };

  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      fromCodePointSafe(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec: string) =>
      fromCodePointSafe(parseInt(dec, 10)),
    )
    .replace(
      /&(amp|lt|gt|quot|apos|nbsp);/gi,
      (match, name: string) =>
        (
          {
            amp: "&",
            lt: "<",
            gt: ">",
            quot: '"',
            apos: "'",
            nbsp: "\u00a0",
          } as Record<string, string>
        )[name.toLowerCase()] ?? match,
    );
}

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
  return str.toLowerCase().replace("_", "-").split(" ").join("-");
}

function pascalCaseToScreamingSnakeCase(str: string): string {
  return str
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .toUpperCase()
    .slice(1);
}

function pascalCaseToTitleCase(str: string): string {
  return str
    .replace(/[A-Z]/g, (letter) => ` ${letter}`)
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function splitAtDigitAndJoin(str: string): string {
  return str.split(/(\d.*)/, 2).join(" ");
}

function downloadCsv(csvString: string, fileName = "data.csv") {
  // Create a Blob from the CSV string
  const blob = new Blob([csvString], { type: "text/csv" });

  // Create a link element
  const link = document.createElement("a");

  // Set the download attribute with the desired file name
  link.download = fileName;

  // Create an object URL for the Blob
  link.href = URL.createObjectURL(blob);

  // Append the link to the body (it needs to be in the DOM to trigger the download in some browsers)
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Remove the link from the DOM
  document.body.removeChild(link);
}

export {
  decodeHtmlEntities,
  titleCase,
  kebabCase,
  splitAtDigitAndJoin,
  pascalCaseToScreamingSnakeCase,
  pascalCaseToTitleCase,
  downloadCsv,
};
