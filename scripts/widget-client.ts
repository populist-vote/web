(function () {
  const script = document.currentScript as HTMLScriptElement;
  const populistOrigin = new URL(script.src).origin;
  const attributes = script.dataset;
  const params: Record<string, string> = {};

  const url = new URL(location.href);
  const cleanedLocation = url.toString();

  params.billId = attributes.billId || "";
  params.embedId = attributes.embedId || "";
  params.origin = cleanedLocation;

  const containerName = `.populist-${params.embedId}`;

  const existingContainer = document.querySelector(containerName);

  const id = existingContainer && existingContainer.id;
  if (id) {
    params.origin = `${cleanedLocation}#${id}`;
  }

  // Compute embed source URL and loading attribute
  const src = `${populistOrigin}/embeds/${"bill"}?${new URLSearchParams(
    params
  )}`;
  const loading = attributes.loading === "lazy" ? "lazy" : undefined;

  // Set up iframe element
  const iframeElement = document.createElement(`iframe-${params.embedId}`);
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
  ${containerName}, .populist-frame {
    border-radius: 15px;
    width: 100%;
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
    iframeContainer.setAttribute("class", containerName);
    iframeContainer.appendChild(iframeElement);

    script.insertAdjacentElement("afterend", iframeContainer);
  } else {
    while (existingContainer.firstChild) existingContainer.firstChild.remove();
    existingContainer.appendChild(iframeElement);
  }

  // Resize iframe by listening to messages
  window.addEventListener("message", (event) => {
    if (event.origin !== populistOrigin) return;
    const { data } = event;

    if (!(typeof data === "object" && data.populist)) return;

    if (data.populist.resizeHeight) {
      iframeElement.style.height = `${data.populist.resizeHeight}px`;
    }
  });
})();
