(function () {
    var globalKey = "_populistEmbedInitialized_".concat(Date.now().toString(36));
    if (window[globalKey])
        return;
    window[globalKey] = true;
    var script = document.currentScript;
    if (!script) {
        console.error("Populist Embed: `document.currentScript` is null.");
        return;
    }
    var embedId = script.dataset.embedId;
    if (!embedId) {
        console.error("Populist Embed: Missing `data-embed-id` attribute.");
        return;
    }
    var populistOrigin = new URL(script.src).origin;
    var containerSelector = ".populist-".concat(embedId);
    var iframeId = "populist-iframe-".concat(embedId);
    var loadingAttr = script.dataset.loading || "lazy";
    var buildIframe = function (src) {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("class", "populist-frame populist-frame--loading");
        iframe.setAttribute("id", iframeId);
        iframe.setAttribute("title", "Populist Widget");
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("allow", "clipboard-write");
        iframe.setAttribute("src", src);
        iframe.setAttribute("loading", loadingAttr);
        iframe.addEventListener("load", function () {
            iframe.classList.remove("populist-frame--loading");
        });
        return iframe;
    };
    var appendStyles = function () {
        if (document.getElementById("populist-css"))
            return;
        var style = document.createElement("style");
        style.id = "populist-css";
        style.textContent = "\n      ".concat(containerSelector, ", .populist-frame {\n        border-radius: 15px;\n        width: 100%;\n      }\n\n      .populist-frame {\n        border: none;\n        color-scheme: light dark;\n      }\n\n      .populist-frame--loading {\n        opacity: 0;\n      }\n    ");
        document.head.prepend(style);
    };
    var setupMessageListener = function () {
        window.addEventListener("message", function (event) {
            if (event.origin !== populistOrigin)
                return;
            var data = event.data;
            if (typeof data !== "object" || !data || !("populist" in data))
                return;
            var populistData = data.populist;
            var targetIframe = document.getElementById(iframeId);
            if (!targetIframe)
                return;
            if (populistData.embedId === embedId && populistData.resizeHeight) {
                targetIframe.style.height = "".concat(populistData.resizeHeight, "px");
            }
        });
    };
    var createAndAppendIframe = function () {
        var existingIframe = document.getElementById(iframeId);
        var container = document.querySelector(containerSelector);
        if (container) {
            if (!existingIframe || existingIframe.parentElement !== container) {
                if (existingIframe)
                    existingIframe.remove();
                var originUrl = new URL(location.href);
                var origin_1 = originUrl.toString();
                if (container.id) {
                    origin_1 += "#".concat(container.id);
                }
                var iframeSrc = "".concat(populistOrigin, "/embeds/").concat(embedId, "?").concat(new URLSearchParams({
                    origin: origin_1,
                }));
                var iframe = buildIframe(iframeSrc);
                container.innerHTML = "";
                container.appendChild(iframe);
            }
        }
        else if (existingIframe) {
            existingIframe.remove();
        }
    };
    var observeContainer = function () {
        console.warn("Populist Embed: Waiting for container ".concat(containerSelector, "..."));
        var observer = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var mutation = mutations[i];
                var addedNodes = mutation.addedNodes;
                for (var j = 0; j < addedNodes.length; j++) {
                    var node = addedNodes[j];
                    if (node.nodeType === 1 &&
                        node.matches(containerSelector)) {
                        observer.disconnect();
                        console.log("Populist Embed: Container found. Injecting iframe.");
                        createAndAppendIframe();
                        return;
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(function () {
            observer.disconnect();
            console.warn("Populist Embed: Timeout waiting for ".concat(containerSelector, "."));
        }, 10000);
    };
    var handlePopState = function () {
        window.addEventListener("popstate", function () {
            console.log("Populist Embed: Popstate detected. Re-evaluating DOM.");
            createAndAppendIframe();
        });
    };
    var handlePageShow = function () {
        window.addEventListener("pageshow", function (event) {
            if (event.persisted) {
                console.log("Populist Embed: Page restored from bfcache. Re-initializing.");
                createAndAppendIframe();
            }
        });
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "visible") {
                var iframe = document.getElementById(iframeId);
                var container = document.querySelector(containerSelector);
                if (container && !iframe) {
                    console.log("Populist Embed: Re-attaching iframe after tab visibility change.");
                    createAndAppendIframe();
                }
            }
        });
    };
    var initialize = function () {
        appendStyles();
        setupMessageListener();
        handlePopState();
        handlePageShow();
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", function () {
                var container = document.querySelector(containerSelector);
                if (container && !document.getElementById(iframeId)) {
                    createAndAppendIframe();
                }
                else if (!container) {
                    observeContainer();
                }
            });
        }
        else {
            var container = document.querySelector(containerSelector);
            if (container && !document.getElementById(iframeId)) {
                createAndAppendIframe();
            }
            else if (!container) {
                observeContainer();
            }
        }
    };
    // Expose for manual SPA hooks if needed
    window.populistEmbedInit = initialize;
    initialize();
})();
