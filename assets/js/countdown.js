// =============================
// LOGIN + COUNTDOWN CLIENT
// =============================

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("loginError");

    error.innerHTML = "";

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            error.innerHTML = data.error || "Eitss Salah wleeee :p";
            return;
        }

        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("countdownScreen").style.display = "flex";
        startCountdown();
    } catch (e) {
        error.innerHTML = "Eitss Jangan Di Paksa Dong :p";
    }
}

function startCountdown() {
    // 22 September 2026 pukul 00:00 WIB (UTC+7)
    const targetDate = new Date("2026-09-22T00:00:00+07:00").getTime();

    function tick() {
        const now = Date.now();
        const distance = targetDate - now;

        if (distance <= 0) {
            document.getElementById("days").innerHTML = "00";
            document.getElementById("hours").innerHTML = "00";
            document.getElementById("minutes").innerHTML = "00";
            document.getElementById("seconds").innerHTML = "00";

            document.getElementById("countdownScreen").style.display = "none";
            document.body.classList.add("gate-open");
            if (window.loadProtectedLanding) window.loadProtectedLanding();
            return;
        }

        const days = Math.floor(distance / 86400000);
        const hours = Math.floor((distance % 86400000) / 3600000);
        const minutes = Math.floor((distance % 3600000) / 60000);
        const seconds = Math.floor((distance % 60000) / 1000);

        document.getElementById("days").innerHTML = String(days).padStart(2, "0");
        document.getElementById("hours").innerHTML = String(hours).padStart(2, "0");
        document.getElementById("minutes").innerHTML = String(minutes).padStart(2, "0");
        document.getElementById("seconds").innerHTML = String(seconds).padStart(2, "0");

        setTimeout(tick, 1000);
    }

    tick();
}
