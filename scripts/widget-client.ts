(function () {
  const script = document.currentScript as HTMLScriptElement;
  if (!script) {
    // Script might not be found in certain environments or contexts (like popstate).
    // We'll need a different way to get attributes later if needed for popstate.
    console.error("Populist Embed Script: document.currentScript is null.");
    return;
  }

  script.defer = true;
  const populistOrigin = new URL(script.src).origin;
  const attributes = script.dataset;

  // Ensure embedId is available
  if (!attributes.embedId) {
    console.error("Populist Embed Script: data-embed-id attribute is missing.");
    return;
  }

  const iframeId = `populist-iframe-${attributes.embedId}`;
  const containerName = `.populist-${attributes.embedId}`;

  // Function to create and append the iframe
  const createAndAppendIframe = () => {
    // Prevent creating duplicate iframes
    if (document.getElementById(iframeId)) {
      return;
    }

    const params: Record<string, string> = {};
    const url = new URL(location.href);
    const cleanedLocation = url.toString();
    params.origin = cleanedLocation;

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

    // Create default style if it doesn't exist and prepend
    const style =
      document.getElementById("populist-css") ||
      document.createElement("style");
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
    .populist-frame--loading { /* Fix typo */
      opacity: 0;
    }
  `;
    // Ensure style is in the head
    if (!document.head.contains(style)) {
      document.head.prepend(style);
    }

    // Ensure the container div is created first
    existingContainer = document.querySelector(containerName); // Re-query just before appending

    if (existingContainer) {
      // Clear any existing content and append the iframe
      while (existingContainer.firstChild)
        existingContainer.firstChild.remove();
      existingContainer.appendChild(iframeElement);

      // Resize iframe by listening to messages
      window.addEventListener("message", (event) => {
        // Ensure embedId matches the currently active embed on the page
        // (important if multiple embeds are on the same page)
        const targetIframe = document.getElementById(iframeId);
        if (!targetIframe || event.origin !== populistOrigin) return;

        const { data } = event;

        if (!(typeof data === "object" && data.populist)) return;

        if (
          data.populist.resizeHeight &&
          attributes.embedId === data.populist.embedId // Fix typo
        ) {
          targetIframe.style.height = `${data.populist.resizeHeight}px`;
        }
      });
    } else {
      // If container still not found, set up MutationObserver
      console.warn(
        `Populist Embed Script: Container ${containerName} not found on initial check. Setting up observer.`
      );
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            const addedNodes = Array.from(mutation.addedNodes);
            const foundContainer = addedNodes.find((node) => {
              return (
                node.nodeType === 1 &&
                (node as HTMLElement).matches(containerName)
              );
            }) as HTMLElement;

            if (foundContainer) {
              observer.disconnect();
              console.log(
                `Populist Embed Script: Container ${containerName} found via observer. Appending iframe.`
              );
              // Now that the container is found, clear its content and append
              while (foundContainer.firstChild)
                foundContainer.firstChild.remove();
              foundContainer.appendChild(iframeElement);

              // Resize iframe by listening to messages - attach listener once
              window.addEventListener("message", (event) => {
                const targetIframe = document.getElementById(iframeId);
                if (!targetIframe || event.origin !== populistOrigin) return;

                const { data } = event;

                if (!(typeof data === "object" && data.populist)) return;

                if (
                  data.populist.resizeHeight &&
                  attributes.embedId === data.populist.embedId // Fix typo
                ) {
                  targetIframe.style.height = `${data.populist.resizeHeight}px`;
                }
              });

              break; // Stop observing once the container is found
            }
          }
        }
      });

      // Start observing the body for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true, // Observe changes in descendants as well
      });

      // Optional: Set a timeout for the observer in case the container never appears
      // This prevents the observer from running indefinitely on pages without the container
      setTimeout(() => {
        if (document.getElementById(iframeId) === null) {
          console.warn(
            `Populist Embed Script: Container ${containerName} not found after timeout. Stopping observer.`
          );
          observer.disconnect();
        }
      }, 10000); // Adjust timeout (e.g., 10 seconds)
    }
  };

  // --- Execution Flow ---

  // 1. Initial load: Wait for the DOM to be ready
  //    `defer` helps, but explicit check can be safer for complex pages.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createAndAppendIframe);
  } else {
    // DOM is already ready
    createAndAppendIframe();
  }

  // 2. Handle Popstate (History Navigation)
  window.addEventListener("popstate", () => {
    console.log("Populist Embed Script: Popstate event detected. Re-checking.");
    // We need to re-run the logic to find the container and potentially add the iframe
    // for the new state.

    // First, check if an iframe with this ID already exists.
    // If it does, it might be the correct one, or a leftover from a previous state.
    const existingIframe = document.getElementById(iframeId);
    const currentContainer = document.querySelector(containerName);

    if (existingIframe && currentContainer) {
      // An iframe exists and the container for this embedId is on the page.
      // Assume it's potentially correct, but re-check its parent.
      if (existingIframe.parentElement === currentContainer) {
        console.log(
          "Populist Embed Script: Iframe and container found in expected state. No action needed."
        );
        // The iframe is already in the correct container. Nothing to do.
        // You might want to send a message to the iframe here to signal the state change
        // if its internal content needs to update based on URL parameters.
      } else {
        // The iframe exists but is not in the correct container. Remove it and re-add.
        console.log(
          "Populist Embed Script: Iframe found but not in correct container. Removing and recreating."
        );
        existingIframe.remove();
        createAndAppendIframe(); // Create and append the new iframe
      }
    } else if (!existingIframe && currentContainer) {
      // No iframe exists, but the container for this embedId is on the page.
      // This means the widget wasn't loaded for this history state, or was removed.
      console.log(
        "Populist Embed Script: Container found, but no iframe. Creating and appending."
      );
      createAndAppendIframe(); // Create and append the iframe
    } else if (existingIframe && !currentContainer) {
      // An iframe exists, but the container for this embedId is not on the page.
      // This iframe is a leftover from a previous page state and should be removed.
      console.log(
        "Populist Embed Script: Iframe found, but no container. Removing leftover iframe."
      );
      existingIframe.remove();
    } else {
      // Neither iframe nor container exists for this embedId in the current state.
      console.log(
        "Populist Embed Script: Neither iframe nor container found for this embedId. No action needed."
      );
    }
  });
})();
