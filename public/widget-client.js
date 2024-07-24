(function () {
    var script = document.currentScript;
    script.defer = true;
    var populistOrigin = new URL(script.src).origin;
    var attributes = script.dataset;
    var params = {};
    var url = new URL(location.href);
    var cleanedLocation = url.toString();
    params.origin = cleanedLocation;
    var containerName = ".populist-".concat(attributes.embedId);
    var existingContainer = document.querySelector(containerName);
    var id = existingContainer && existingContainer.id;
    if (id) {
        params.origin = "".concat(cleanedLocation, "#").concat(id);
    }
    // Compute embed source URL and loading attribute
    var src = "".concat(populistOrigin, "/embeds/").concat(attributes.embedId, "?").concat(new URLSearchParams(params));
    var loading = attributes.loading || "lazy";
    // Set up iframe element
    var iframeId = "populist-iframe-".concat(attributes.embedId);
    if (document.getElementById(iframeId)) {
        return; // Prevent creating duplicate iframes
    }
    var iframeElement = document.createElement("iframe");
    var iframeAttributes = {
        class: "populist-frame populist-frame--loading",
        id: iframeId,
        title: "Populist Widget",
        scrolling: "no",
        allow: "clipboard-write",
        src: src,
        loading: loading,
    };
    Object.entries(iframeAttributes).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        return value && iframeElement.setAttribute(key, value);
    });
    iframeElement.addEventListener("load", function () {
        iframeElement.classList.remove("populist-frame--loading");
    });
    // Create default style and prepend as <head>'s first child to make override possible.
    var style = document.getElementById("populist-css") || document.createElement("style");
    style.id = "populist-css";
    style.textContent = "\n  ".concat(containerName, ", .populist-frame {\n    border-radius: 15px;\n    width: 100%;\n  }\n\n  .populist-frame {\n    border: none;\n    color-scheme: light dark;\n  }\n  .populist-frame--loading {\n    opacity: 0;\n  }\n");
    document.head.prepend(style);
    // Ensure the container div is created first
    if (!existingContainer) {
        var observer_1 = new MutationObserver(function (mutations) {
            for (var _i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
                var mutation = mutations_1[_i];
                if (mutation.type === "childList") {
                    existingContainer = document.querySelector(containerName);
                    if (existingContainer) {
                        observer_1.disconnect();
                        existingContainer.appendChild(iframeElement);
                        break;
                    }
                }
            }
        });
    }
    // Clear any existing content and append the iframe
    while (existingContainer === null || existingContainer === void 0 ? void 0 : existingContainer.firstChild)
        existingContainer === null || existingContainer === void 0 ? void 0 : existingContainer.firstChild.remove();
    existingContainer === null || existingContainer === void 0 ? void 0 : existingContainer.appendChild(iframeElement);
    // Resize iframe by listening to messages
    window.addEventListener("message", function (event) {
        if (event.origin !== populistOrigin)
            return;
        var data = event.data;
        if (!(typeof data === "object" && data.populist))
            return;
        if (data.populist.resizeHeight &&
            attributes.embedId === data.populist.embedId) {
            iframeElement.style.height = "".concat(data.populist.resizeHeight, "px");
        }
    });
})();
