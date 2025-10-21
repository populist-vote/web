var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/*!
 * Populist Embed v2
 * Single-script, multi-widget implementation
 */
(function () {
    var _a;
    var w = window;
    if ((_a = w.PopulistEmbed) === null || _a === void 0 ? void 0 : _a.initialized)
        return;
    var currentScript = document.currentScript;
    var scriptSrc = currentScript && currentScript instanceof HTMLScriptElement
        ? currentScript.src
        : location.href;
    var PopulistEmbed = {
        initialized: true,
        origin: new URL(scriptSrc).origin,
        iframes: new Map(),
        log: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log.apply(console, __spreadArray(["[Populist Embed]"], args, false));
        },
        buildIframe: function (embedId, container) {
            var iframeId = "populist-iframe-".concat(embedId);
            var loading = container.dataset.loading || "lazy";
            var iframe = document.createElement("iframe");
            iframe.id = iframeId;
            iframe.className = "populist-frame populist-frame--loading";
            iframe.title = "Populist Widget";
            iframe.scrolling = "no";
            iframe.allow = "clipboard-write";
            iframe.loading = loading;
            var originUrl = new URL(location.href);
            var originParam = originUrl.toString();
            var src = "".concat(PopulistEmbed.origin, "/embeds/").concat(embedId, "?").concat(new URLSearchParams({ origin: originParam }));
            iframe.src = src;
            iframe.addEventListener("load", function () {
                iframe.classList.remove("populist-frame--loading");
            });
            PopulistEmbed.iframes.set(embedId, iframe);
            return iframe;
        },
        appendStyles: function () {
            if (document.getElementById("populist-css"))
                return;
            var style = document.createElement("style");
            style.id = "populist-css";
            style.textContent = "\n        .populist-frame {\n          border: none;\n          border-radius: 15px;\n          width: 100%;\n          color-scheme: light dark;\n        }\n\n        .populist-frame--loading {\n          opacity: 0;\n        }\n      ";
            document.head.prepend(style);
        },
        setupMessageListener: function () {
            window.addEventListener("message", function (event) {
                if (event.origin !== PopulistEmbed.origin)
                    return;
                var data = event.data;
                if (typeof data !== "object" || !data || !("populist" in data))
                    return;
                var populistData = data.populist;
                if (!populistData.embedId)
                    return;
                var iframe = PopulistEmbed.iframes.get(populistData.embedId);
                if (iframe && populistData.resizeHeight) {
                    iframe.style.height = "".concat(populistData.resizeHeight, "px");
                }
            });
        },
        createIframeIn: function (container) {
            var embedId = container.dataset.embedId;
            if (!embedId)
                return;
            var iframeId = "populist-iframe-".concat(embedId);
            var existingIframe = document.getElementById(iframeId);
            if (existingIframe)
                existingIframe.remove();
            var iframe = PopulistEmbed.buildIframe(embedId, container);
            container.innerHTML = "";
            container.appendChild(iframe);
        },
        renderAll: function () {
            PopulistEmbed.appendStyles();
            var containers = document.querySelectorAll("[data-embed-id].populist-embed");
            containers.forEach(function (container) {
                return PopulistEmbed.createIframeIn(container);
            });
        },
        observeNewContainers: function () {
            var observer = new MutationObserver(function (mutations) {
                for (var _i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
                    var mutation = mutations_1[_i];
                    mutation.addedNodes.forEach(function (node) {
                        var _a, _b;
                        if (node.nodeType === 1 &&
                            ((_b = (_a = node).matches) === null || _b === void 0 ? void 0 : _b.call(_a, "[data-embed-id].populist-embed"))) {
                            PopulistEmbed.log("Detected new embed container");
                            PopulistEmbed.createIframeIn(node);
                        }
                    });
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        },
        handlePageEvents: function () {
            window.addEventListener("popstate", function () { return PopulistEmbed.renderAll(); });
            window.addEventListener("pageshow", function (event) {
                if (event.persisted)
                    PopulistEmbed.renderAll();
            });
            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState === "visible")
                    PopulistEmbed.renderAll();
            });
        },
        init: function () {
            PopulistEmbed.appendStyles();
            PopulistEmbed.setupMessageListener();
            PopulistEmbed.handlePageEvents();
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", PopulistEmbed.renderAll);
            }
            else {
                PopulistEmbed.renderAll();
            }
            PopulistEmbed.observeNewContainers();
            PopulistEmbed.log("Initialized and awaiting embeds...");
        },
    };
    window.PopulistEmbed = PopulistEmbed;
    PopulistEmbed.init();
})();
