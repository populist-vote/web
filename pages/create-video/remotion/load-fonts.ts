// Loads fonts for the composition

import { continueRender, delayRender, staticFile } from "remotion";

const waitForFont = delayRender();

const fontWeights = [
  {
    name: "commuterSansLight",
    file: "fonts/commuter_sans_light-webfont.woff2",
  },
  {
    name: "commuterSansRegular",
    file: "fonts/commuter_sans_regular-webfont.woff2",
  },
  {
    name: "commuterSansSemiBold",
    file: "fonts/commuter_sans_semi_bold-webfont.woff2",
  },
  {
    name: "commuterSansBold",
    file: "fonts/commuter_sans_bold-webfont.woff2",
  },
  {
    name: "proximaNovaRegular",
    file: "fonts/proximanova-regular-webfont.woff2",
  },
];

Promise.all(
  fontWeights.map((fontWeight) => {
    const font = new FontFace(
      fontWeight.name,
      `url('${staticFile(fontWeight.file)}') format('woff2')`
    );
    return font.load().then(() => {
      document.fonts.add(font);
    });
  })
)
  .then(() => {
    continueRender(waitForFont);
  })
  .catch((err) => console.log("Error loading fonts", err));
