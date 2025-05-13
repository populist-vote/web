(function () {
  const globalKey = `_populistEmbedInitialized_${Date.now().toString(36)}`;

  if ((window as any)[globalKey]) return;
  (window as any)[globalKey] = true;

  const script = document.currentScript as HTMLScriptElement | null;

  if (!script) {
    console.error("Populist Embed: `document.currentScript` is null.");
    return;
  }

  const embedId = script.dataset.embedId;
  if (!embedId) {
    console.error("Populist Embed: Missing `data-embed-id` attribute.");
    return;
  }

  const populistOrigin = new URL(script.src).origin;
  const containerSelector = `.populist-${embedId}`;
  const iframeId = `populist-iframe-${embedId}`;
  const loadingAttr = script.dataset.loading || "lazy";

  const buildIframe = (src: string): HTMLIFrameElement => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("class", "populist-frame populist-frame--loading");
    iframe.setAttribute("id", iframeId);
    iframe.setAttribute("title", "Populist Widget");
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("allow", "clipboard-write");
    iframe.setAttribute("src", src);
    iframe.setAttribute("loading", loadingAttr);

    iframe.addEventListener("load", () => {
      iframe.classList.remove("populist-frame--loading");
    });

    return iframe;
  };

  const appendStyles = () => {
    if (document.getElementById("populist-css")) return;

    const style = document.createElement("style");
    style.id = "populist-css";
    style.textContent = `
      ${containerSelector}, .populist-frame {
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
  };

  const setupMessageListener = () => {
    window.addEventListener("message", (event) => {
      if (event.origin !== populistOrigin) return;

      const { data } = event;
      if (typeof data !== "object" || !data || !("populist" in data)) return;

      const populistData = (data as any).populist;
      const targetIframe = document.getElementById(
        iframeId
      ) as HTMLIFrameElement | null;

      if (!targetIframe) return;

      if (populistData.embedId === embedId && populistData.resizeHeight) {
        targetIframe.style.height = `${populistData.resizeHeight}px`;
      }
    });
  };

  const createAndAppendIframe = () => {
    const existingIframe = document.getElementById(
      iframeId
    ) as HTMLElement | null;
    const container = document.querySelector(
      containerSelector
    ) as HTMLElement | null;

    if (container) {
      if (!existingIframe || existingIframe.parentElement !== container) {
        if (existingIframe) existingIframe.remove();

        const originUrl = new URL(location.href);
        let origin = originUrl.toString();
        if (container.id) {
          origin += `#${container.id}`;
        }

        const iframeSrc = `${populistOrigin}/embeds/${embedId}?${new URLSearchParams(
          {
            origin,
          }
        )}`;

        const iframe = buildIframe(iframeSrc);
        container.innerHTML = "";
        container.appendChild(iframe);
      }
    } else if (existingIframe) {
      existingIframe.remove();
    }
  };

  const observeContainer = () => {
    console.warn(
      `Populist Embed: Waiting for container ${containerSelector}...`
    );

    const observer = new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i++) {
        const mutation = mutations[i];
        const addedNodes = mutation.addedNodes;
        for (let j = 0; j < addedNodes.length; j++) {
          const node = addedNodes[j];
          if (
            node.nodeType === 1 &&
            (node as HTMLElement).matches(containerSelector)
          ) {
            observer.disconnect();
            console.log("Populist Embed: Container found. Injecting iframe.");
            createAndAppendIframe();
            return;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      console.warn(`Populist Embed: Timeout waiting for ${containerSelector}.`);
    }, 10000);
  };

  const handlePopState = () => {
    window.addEventListener("popstate", () => {
      console.log("Populist Embed: Popstate detected. Re-evaluating DOM.");
      createAndAppendIframe();
    });
  };

  const handlePageShow = () => {
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        console.log(
          "Populist Embed: Page restored from bfcache. Re-initializing."
        );
        createAndAppendIframe();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        const iframe = document.getElementById(iframeId);
        const container = document.querySelector(containerSelector);
        if (container && !iframe) {
          console.log(
            "Populist Embed: Re-attaching iframe after tab visibility change."
          );
          createAndAppendIframe();
        }
      }
    });
  };

  const initialize = () => {
    appendStyles();
    setupMessageListener();
    handlePopState();
    handlePageShow();

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        const container = document.querySelector(containerSelector);
        if (container && !document.getElementById(iframeId)) {
          createAndAppendIframe();
        } else if (!container) {
          observeContainer();
        }
      });
    } else {
      const container = document.querySelector(containerSelector);
      if (container && !document.getElementById(iframeId)) {
        createAndAppendIframe();
      } else if (!container) {
        observeContainer();
      }
    }
  };

  // Expose for manual SPA hooks if needed
  (window as any).populistEmbedInit = initialize;

  initialize();
})();
