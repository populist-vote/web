type PopulistEmbedWindow = typeof window & {
  PopulistEmbed?: {
    initialized?: boolean;
    origin?: string;
    iframes?: Map<string, HTMLIFrameElement>;
    init?: () => void;
    renderAll?: () => void;
  };
};

/*!
 * Populist Embed v2
 * Single-script, multi-widget implementation
 */

(function () {
  const w = window as PopulistEmbedWindow;
  if (w.PopulistEmbed?.initialized) return;

  const currentScript = document.currentScript;
  const scriptSrc =
    currentScript && currentScript instanceof HTMLScriptElement
      ? currentScript.src
      : location.href;

  const PopulistEmbed = {
    initialized: true,
    origin: new URL(scriptSrc).origin,
    iframes: new Map<string, HTMLIFrameElement>(),

    log(...args: unknown[]) {
      console.log("[Populist Embed]", ...args);
    },

    buildIframe(embedId: string, container: HTMLElement): HTMLIFrameElement {
      const iframeId = `populist-iframe-${embedId}`;
      const loading = container.dataset.loading || "lazy";
      const iframe = document.createElement("iframe");
      iframe.id = iframeId;
      iframe.className = "populist-frame populist-frame--loading";
      iframe.title = "Populist Widget";
      iframe.scrolling = "no";
      iframe.allow = "clipboard-write";
      iframe.loading = loading as "lazy" | "eager";
      const originUrl = new URL(location.href);
      const originParam = originUrl.toString();
      const src = `${PopulistEmbed.origin}/embeds/${embedId}?${new URLSearchParams(
        { origin: originParam }
      )}`;
      iframe.src = src;

      iframe.addEventListener("load", () => {
        iframe.classList.remove("populist-frame--loading");
      });

      PopulistEmbed.iframes.set(embedId, iframe);
      return iframe;
    },

    appendStyles() {
      if (document.getElementById("populist-css")) return;
      const style = document.createElement("style");
      style.id = "populist-css";
      style.textContent = `
        .populist-frame {
          border: none;
          border-radius: 15px;
          width: 100%;
          color-scheme: light dark;
        }

        .populist-frame--loading {
          opacity: 0;
        }
      `;
      document.head.prepend(style);
    },

    setupMessageListener() {
      window.addEventListener("message", (event) => {
        if (event.origin !== PopulistEmbed.origin) return;
        const { data } = event;
        if (typeof data !== "object" || !data || !("populist" in data)) return;
        const populistData = data.populist;
        if (!populistData.embedId) return;

        const iframe = PopulistEmbed.iframes.get(populistData.embedId);
        if (iframe && populistData.resizeHeight) {
          iframe.style.height = `${populistData.resizeHeight}px`;
        }
      });
    },

    createIframeIn(container: HTMLElement) {
      const embedId = container.dataset.embedId;
      if (!embedId) return;
      const iframeId = `populist-iframe-${embedId}`;
      const existingIframe = document.getElementById(iframeId);
      if (existingIframe) existingIframe.remove();

      const iframe = PopulistEmbed.buildIframe(embedId, container);
      container.innerHTML = "";
      container.appendChild(iframe);
    },

    renderAll() {
      PopulistEmbed.appendStyles();
      const containers = document.querySelectorAll<HTMLElement>(
        "[data-embed-id].populist-embed"
      );
      containers.forEach((container) =>
        PopulistEmbed.createIframeIn(container)
      );
    },

    observeNewContainers() {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === 1 &&
              (node as HTMLElement).matches?.("[data-embed-id].populist-embed")
            ) {
              PopulistEmbed.log("Detected new embed container");
              PopulistEmbed.createIframeIn(node as HTMLElement);
            }
          });
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    },

    handlePageEvents() {
      window.addEventListener("popstate", () => PopulistEmbed.renderAll());
      window.addEventListener("pageshow", (event) => {
        if (event.persisted) PopulistEmbed.renderAll();
      });
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") PopulistEmbed.renderAll();
      });
    },

    init() {
      PopulistEmbed.appendStyles();
      PopulistEmbed.setupMessageListener();
      PopulistEmbed.handlePageEvents();

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", PopulistEmbed.renderAll);
      } else {
        PopulistEmbed.renderAll();
      }

      PopulistEmbed.observeNewContainers();
      PopulistEmbed.log("Initialized and awaiting embeds...");
    },
  };

  (window as PopulistEmbedWindow).PopulistEmbed = PopulistEmbed;
  PopulistEmbed.init();
})();
