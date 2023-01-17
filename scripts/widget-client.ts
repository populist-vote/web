(function () {
  const script = document.currentScript as HTMLScriptElement;
  const populistOrigin = new URL(script.src).origin;
  const attributes = script.dataset;
  const params: Record<string, string> = {};

  params.billId = attributes.billId as string;
  params.apiKey =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiMmQ3YjRhOS00M2JjLTQwNzYtOTAxYi05NTkyODFmMDdhODEiLCJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJlbWFpbCI6ImluZm9AcG9wdWxpc3QudXMiLCJyb2xlIjoic3VwZXJ1c2VyIiwiZXhwIjoxNjgzMzkzNDcwfQ.M4-1_UMHMn6wooC-SS3wmCF9R6KbJnMjDCkLDplTmrk";
  const url = new URL(location.href);
  const cleanedLocation = url.toString();
  const existingContainer = document.querySelector(".populist");
  const id = existingContainer && existingContainer.id;
  if (id) {
    params.origin = `${cleanedLocation}#${id}`;
  }

  // Set up iframe src and loading attribute
  const src = `${populistOrigin}/embeds/${"bill"}?${new URLSearchParams(
    params
  )}`;
  const loading = attributes.loading === "lazy" ? "lazy" : undefined;

  // Set up iframe element
  const iframeElement = document.createElement("iframe");
  const iframeAttributes = {
    class: "populist-frame populist-frame--loading",
    title: "Populist Widget",
    scrolling: "no",
    allow: "clipboard-write",
    src,
    loading,
  };
  Object.entries(iframeAttributes).forEach(
    ([key, value]) => value && iframeElement.setAttribute(key, value)
  );
  iframeElement.addEventListener("load", () => {
    iframeElement.classList.remove("populist-frame--loading");
  });

  // Create default style and prepend as <head>'s first child to make override possible.
  const style =
    document.getElementById("populist-css") || document.createElement("style");
  style.id = "populist-css";
  style.textContent = `
  .populist, .populist-frame {
    width: 100%;
    min-height: 600px;
  }
  .populist-frame {
    border: none;
    color-scheme: light dark;
  }
  .populist-frame--loading {
    opacity: 0;
  }
`;
  document.head.prepend(style);

  // Insert iframe element
  if (!existingContainer) {
    const iframeContainer = document.createElement("div");
    iframeContainer.setAttribute("class", "populist");
    iframeContainer.appendChild(iframeElement);

    script.insertAdjacentElement("afterend", iframeContainer);
  } else {
    while (existingContainer.firstChild) existingContainer.firstChild.remove();
    existingContainer.appendChild(iframeElement);
  }
  // const suggestion = `Please consider reporting this error at https://github.com/giscus/giscus/issues/new.`;
})();

export {};
