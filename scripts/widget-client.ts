(function () {
  const script = document.currentScript as HTMLScriptElement;

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
      if (typeof data !== "object" || !data?.populist) return;

      const targetIframe = document.getElementById(iframeId);
      if (!targetIframe) return;

      if (data.populist.embedId === embedId && data.populist.resizeHeight) {
        targetIframe.style.height = `${data.populist.resizeHeight}px`;
      }
    });
  };

  const createAndAppendIframe = () => {
    if (document.getElementById(iframeId)) return;

    const container = document.querySelector(containerSelector);
    if (!container) {
      observeContainer(); // Fallback if not yet present
      return;
    }

    const originUrl = new URL(location.href);
    const params: Record<string, string> = {
      origin: originUrl.toString(),
    };

    if (container.id) {
      params.origin += `#${container.id}`;
    }

    const iframeSrc = `${populistOrigin}/embeds/${embedId}?${new URLSearchParams(params)}`;
    const iframe = buildIframe(iframeSrc);

    container.innerHTML = "";
    container.appendChild(iframe);
  };

  const observeContainer = () => {
    console.warn(
      `Populist Embed: Waiting for container ${containerSelector}...`
    );

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
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
      const existingIframe = document.getElementById(iframeId);
      const container = document.querySelector(containerSelector);

      if (existingIframe && container) {
        if (existingIframe.parentElement !== container) {
          existingIframe.remove();
          createAndAppendIframe();
        }
      } else if (!existingIframe && container) {
        createAndAppendIframe();
      } else if (existingIframe && !container) {
        existingIframe.remove();
      }
    });
  };

  const initialize = () => {
    appendStyles();
    setupMessageListener();
    handlePopState();

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", createAndAppendIframe);
    } else {
      createAndAppendIframe();
    }
  };

  initialize();
})();
