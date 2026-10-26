/* Page 1 welcome screen. Shows a "Tap to open" screen; the tap fades it away
   and the name form is revealed. No audio on this page. */
(function () {
    var css = document.createElement("style");
    css.textContent =
        ".wl-splash{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;" +
        "align-items:center;justify-content:center;gap:14px;padding:24px;text-align:center;" +
        "font-family:'Playfair Display',Georgia,serif;color:#c9578a;cursor:pointer;" +
        "background:radial-gradient(circle at 15% 10%,rgba(255,255,255,.9),transparent 45%)," +
        "linear-gradient(180deg,#fffafc 0%,#ffeef4 45%,#ffd9e6 100%);" +
        "transition:opacity .7s ease;-webkit-tap-highlight-color:transparent}" +
        ".wl-splash.wl-hide{opacity:0;pointer-events:none}" +
        ".wl-splash .wl-env{font-size:76px;line-height:1;animation:wlBob 1.8s ease-in-out infinite}" +
        ".wl-splash h2{margin:0;font-size:clamp(24px,6vw,36px)}" +
        ".wl-splash p{margin:0;font-size:15px;font-style:italic;color:#d8749e}" +
        ".wl-splash button{margin-top:8px;padding:12px 28px;font:600 15px Montserrat,Arial,sans-serif;" +
        "color:#fff;background:#d8749e;border:0;border-radius:999px;box-shadow:0 6px 18px rgba(201,87,138,.35);cursor:pointer}" +
        "@keyframes wlBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}" +
        "@media (prefers-reduced-motion:reduce){.wl-splash .wl-env{animation:none}}";
    document.head.appendChild(css);

    var el = document.createElement("div");
    el.className = "wl-splash";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.innerHTML =
        '<div class="wl-env">💌</div>' +
        "<h2>Leona has a message for you</h2>" +
        '<button type="button">Tap to open</button>';
    document.body.appendChild(el);

    var done = false;
    function open() {
        if (done) return; done = true;
        el.classList.add("wl-hide");
        setTimeout(function () { el.remove(); }, 800);
        var input = document.querySelector("input[type=text], input:not([type])");
        if (input) setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) {} }, 900);
    }
    el.addEventListener("click", open);
    el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
})();