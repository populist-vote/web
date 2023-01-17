(function () {
    var script = document.currentScript;
    var populistOrigin = new URL(script.src).origin;
    var attributes = script.dataset;
    var params = {};
    params.billId = "000d920a-e964-474f-a08b-49b7607f81c2";
    params.apiKey =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiMmQ3YjRhOS00M2JjLTQwNzYtOTAxYi05NTkyODFmMDdhODEiLCJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJlbWFpbCI6ImluZm9AcG9wdWxpc3QudXMiLCJyb2xlIjoic3VwZXJ1c2VyIiwiZXhwIjoxNjgzMzkzNDcwfQ.M4-1_UMHMn6wooC-SS3wmCF9R6KbJnMjDCkLDplTmrk";
    var url = new URL(location.href);
    var cleanedLocation = url.toString();
    var existingContainer = document.querySelector(".populist");
    var id = existingContainer && existingContainer.id;
    if (id) {
        params.origin = "".concat(cleanedLocation, "#").concat(id);
    }
    // Set up iframe src and loading attribute
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
    style.textContent = "\n  .populist, .populist-frame {\n    width: 100%;\n    min-height: 600px;\n  }\n  .populist-frame {\n    border: none;\n    color-scheme: light dark;\n  }\n  .populist-frame--loading {\n    opacity: 0;\n  }\n";
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
    // const suggestion = `Please consider reporting this error at https://github.com/giscus/giscus/issues/new.`;
})();
