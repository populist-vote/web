(function () {
    var script = document.currentScript;
    var populistOrigin = new URL(script.src).origin;
    var attributes = script.dataset;
    var params = {};
    var url = new URL(location.href);
    var cleanedLocation = url.toString();
    params.billId = attributes.billId;
    params.origin = cleanedLocation;
    var existingContainer = document.querySelector(".populist");
    var id = existingContainer && existingContainer.id;
    if (id) {
        params.origin = "".concat(cleanedLocation, "#").concat(id);
    }
    // Compute embed source URL and loading attribute
    var src = "".concat(populistOrigin, "/embeds/").concat("bill", "?").concat(new URLSearchParams(params));
    var loading = attributes.loading === "lazy" ? "lazy" : undefined;
    // Set up iframe element
    var iframeElement = document.createElement("iframe");
    var iframeAttributes = {
        "class": "populist-frame populist-frame--loading",
        title: "Populist Widget",
        scrolling: "no",
        allow: "clipboard-write",
        src: src,
        loading: loading
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
    style.textContent = "\n  .populist, .populist-frame {\n    border-radius: 15px;\n    width: 100%;\n  }\n\n  .populist-frame {\n    border: none;\n    color-scheme: light dark;\n  }\n  .populist-frame--loading {\n    opacity: 0;\n  }\n";
    document.head.prepend(style);
    // Insert iframe element
    if (!existingContainer) {
        var iframeContainer = document.createElement("div");
        iframeContainer.setAttribute("class", "populist");
        iframeContainer.appendChild(iframeElement);
        script.insertAdjacentElement("afterend", iframeContainer);
    }
    else {
        while (existingContainer.firstChild)
            existingContainer.firstChild.remove();
        existingContainer.appendChild(iframeElement);
    }
    // Resize iframe by listening to messages
    window.addEventListener("message", function (event) {
        if (event.origin !== populistOrigin)
            return;
        var data = event.data;
        console.log("heeeredadfasdf", data);
        if (!(typeof data === "object" && data.populist))
            return;
        if (data.populist.resizeHeight) {
            iframeElement.style.height = "".concat(data.populist.resizeHeight, "px");
        }
    });
})();
