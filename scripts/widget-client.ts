(function () {
  const script = document.currentScript as HTMLScriptElement;
  script.defer = true;
  const populistOrigin = new URL(script.src).origin;
  const attributes = script.dataset;
  const params: Record<string, string> = {};
  const url = new URL(location.href);
  const cleanedLocation = url.toString();
  params.origin = cleanedLocation;

  const containerName = `.populist-${attributes.embedId}`;
  let existingContainer = document.querySelector(containerName);
  const id = existingContainer && existingContainer.id;
  if (id) {
    params.origin = `${cleanedLocation}#${id}`;
  }

  // Compute embed source URL and loading attribute
  const src = `${populistOrigin}/embeds/${
    attributes.embedId
  }?${new URLSearchParams(params)}`;
  const loading = attributes.loading || "lazy";

  // Set up iframe element
  const iframeId = `populist-iframe-${attributes.embedId}`;
  if (document.getElementById(iframeId)) {
    return; // Prevent creating duplicate iframes
  }
  const iframeElement = document.createElement("iframe");
  const iframeAttributes = {
    class: "populist-frame populist-frame--loading",
    id: iframeId,
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

  // Ensure the container div is created first
  if (!existingContainer) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          existingContainer = document.querySelector(containerName);
          if (existingContainer) {
            observer.disconnect();
            existingContainer.appendChild(iframeElement);
            break;
          }
        }
      }
    });
  }

  // Clear any existing content and append the iframe
  while (existingContainer?.firstChild) existingContainer?.firstChild.remove();
  existingContainer?.appendChild(iframeElement);

  // Resize iframe by listening to messages
  window.addEventListener("message", (event) => {
    if (event.origin !== populistOrigin) return;
    const { data } = event;

    if (!(typeof data === "object" && data.populist)) return;

    if (
      data.populist.resizeHeight &&
      attributes.embedId === data.populist.embedId
    ) {
      iframeElement.style.height = `${data.populist.resizeHeight}px`;
    }
  });
})();
