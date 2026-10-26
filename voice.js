/* Leona background music for invitation.html
   Loops audio/music.mp3 seamlessly until the guest taps the mute button.

   Uses the Web Audio API, so the loop does not depend on the server
   supporting seeking (VS Code Live Server does not, which made plain
   <audio loop> stop after the first play).

   Start it from a click:  LeonaVoice.start();
   Needs:  <button id="voiceBtn" class="voice-btn" hidden></button>
*/
(function () {
    var AUDIO_SRC = "audio/music.mp3";

    var ctx = null;          // AudioContext
    var gain = null;
    var source = null;       // looping buffer source
    var buffer = null;       // decoded mp3
    var loading = null;      // fetch/decode promise
    var fallback = null;     // plain <audio>, only used if Web Audio fails
    var wantPlay = false;    // true = guest wants music on
    var btn = null;

    function log() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift("[music]");
        console.log.apply(console, args);
    }

    function setBtn() {
        if (!btn) return;
        btn.textContent = wantPlay ? "🔊" : "🔇";
        btn.setAttribute("aria-label", wantPlay ? "Mute music" : "Play music");
    }

    function loadBuffer() {
        if (buffer) return Promise.resolve(buffer);
        if (loading) return loading;

        loading = fetch(AUDIO_SRC)
            .then(function (res) {
                if (!res.ok) throw new Error("HTTP " + res.status + " for " + AUDIO_SRC);
                return res.arrayBuffer();
            })
            .then(function (data) {
                return new Promise(function (resolve, reject) {
                    ctx.decodeAudioData(data, resolve, reject);
                });
            })
            .then(function (decoded) {
                buffer = decoded;
                log("loaded, length:", decoded.duration.toFixed(2) + "s");
                return decoded;
            });

        loading.catch(function () { loading = null; });
        return loading;
    }

    function startFallback() {
        log("using fallback <audio>");
        if (!fallback) {
            fallback = new Audio(AUDIO_SRC);
            fallback.loop = true;
            fallback.addEventListener("ended", function () {
                if (wantPlay) {
                    fallback.currentTime = 0;
                    fallback.play().catch(function () {});
                }
            });
            fallback.addEventListener("error", function () {
                console.warn("[music] could not load " + AUDIO_SRC +
                    ". Check that the audio folder sits next to invitation.html.");
                wantPlay = false;
                setBtn();
            });
        }
        fallback.play().catch(function (err) {
            log("play() failed:", err && err.name);
        });
    }

    function start() {
        wantPlay = true;
        setBtn();

        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return startFallback();

        if (!ctx) {
            ctx = new AC();
            gain = ctx.createGain();
            gain.connect(ctx.destination);
        }
        if (ctx.state === "suspended") ctx.resume();

        if (source) return;   // already created, resume() above continues it

        loadBuffer()
            .then(function (b) {
                if (!wantPlay || source) return;
                source = ctx.createBufferSource();
                source.buffer = b;
                source.loop = true;          // gapless loop from memory
                source.connect(gain);
                source.start(0);
                log("playing (looping)");
            })
            .catch(function (err) {
                console.warn("[music] Web Audio failed:", err);
                startFallback();
            });
    }

    function stop() {
        wantPlay = false;
        setBtn();
        if (ctx && ctx.state === "running") ctx.suspend();
        if (fallback) fallback.pause();
    }

    window.LeonaVoice = {
        start: function () {
            btn = document.getElementById("voiceBtn");
            if (btn) {
                btn.hidden = false;
                btn.onclick = function () { wantPlay ? stop() : start(); };
            }
            start();
        },
        stop: stop
    };

    // Pause when the guest leaves the tab, resume when they come back
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            if (ctx && ctx.state === "running") ctx.suspend();
            if (fallback) fallback.pause();
        } else if (wantPlay) {
            if (ctx) ctx.resume();
            if (fallback) fallback.play().catch(function () {});
        }
    });

    // Stop completely when leaving the page (back button, closing the tab)
    window.addEventListener("pagehide", function () {
        wantPlay = false;
        if (source) { try { source.stop(); } catch (e) {} source = null; }
        if (ctx) { try { ctx.close(); } catch (e) {} ctx = null; gain = null; }
        if (fallback) fallback.pause();
    });
})();