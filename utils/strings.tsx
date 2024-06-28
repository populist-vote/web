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
  titleCase,
  kebabCase,
  splitAtDigitAndJoin,
  pascalCaseToScreamingSnakeCase,
  pascalCaseToTitleCase,
  downloadCsv,
};
