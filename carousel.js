(function () {
    const track = document.getElementById("carouselTrack");
    const prev = document.getElementById("carouselPrev");
    const next = document.getElementById("carouselNext");
    const dotsBox = document.getElementById("carouselDots");
    const saveLink = document.getElementById("carouselSave");
    if (!track || !prev || !next) return;

    const slides = Array.from(track.querySelectorAll(".carousel-slide"));
    let current = 0;

    // Himoa ang dots
    const dots = slides.map(function (_, i) {
        const d = document.createElement("button");
        d.type = "button";
        d.className = "carousel-dot";
        d.setAttribute("aria-label", "Go to photo " + (i + 1));
        d.addEventListener("click", function () { goTo(i); });
        dotsBox.appendChild(d);
        return d;
    });

    function update(i) {
        current = i;
        dots.forEach(function (d, n) {
            d.classList.toggle("is-active", n === i);
        });
        const img = slides[i].querySelector("img");
        if (img && saveLink) {
            saveLink.href = img.getAttribute("src");
            saveLink.setAttribute("download", "leona-photo-" + (i + 1) + ".jpg");
        }
    }

    function goTo(i) {
        const count = slides.length;
        const target = (i + count) % count;   // mo-balik sa una kung naa na sa katapusan
        track.scrollTo({ left: target * track.clientWidth, behavior: "smooth" });
        update(target);
    }

    prev.addEventListener("click", function () { goTo(current - 1); });
    next.addEventListener("click", function () { goTo(current + 1); });

    // Mo-sync ang dots ug "Save this photo" kung mo-swipe
    let timer;
    track.addEventListener("scroll", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            if (!track.clientWidth) return;
            const i = Math.round(track.scrollLeft / track.clientWidth);
            if (i !== current) update(i);
        }, 80);
    });

    update(0);
})();