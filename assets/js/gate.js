(function () {
    const loader = document.getElementById("loader");
    const loginScreen = document.getElementById("loginScreen");
    const countdownScreen = document.getElementById("countdownScreen");
    const targetDate = new Date("2026-09-22T00:00:00+07:00").getTime();

    async function loadProtectedLanding() {
        try {
            const response = await fetch("/api/landing", {
                credentials: "same-origin",
                cache: "no-store"
            });

            if (!response.ok) {
                // If the browser clock says it is open but the server says no,
                // keep the gate closed. The server is authoritative.
                document.body.classList.remove("gate-open");
                if (countdownScreen) countdownScreen.style.display = "flex";
                if (loader) loader.style.display = "none";
                return;
            }

            const html = await response.text();
            const holder = document.getElementById("protectedLanding");
            if (!holder) return;

            // Parse the protected document without executing inline scripts automatically.
            const doc = new DOMParser().parseFromString(html, "text/html");
            Array.from(doc.body.childNodes).forEach(node => holder.appendChild(node));

            // Execute scripts only after the server has released the protected HTML.
            Array.from(holder.querySelectorAll("script")).forEach(oldScript => {
                const newScript = document.createElement("script");
                if (oldScript.src) newScript.src = oldScript.src;
                else newScript.textContent = oldScript.textContent;
                oldScript.replaceWith(newScript);
            });

            holder.querySelectorAll("img").forEach(img => img.loading = "eager");
            if (loader) loader.style.display = "none";
            document.body.classList.add("gate-open");
        } catch (e) {
            document.body.classList.remove("gate-open");
            if (loader) loader.style.display = "none";
        }
    }

    window.loadProtectedLanding = loadProtectedLanding;

    // The server, not this clock, is the security boundary.
    // We only use the browser clock to decide when to ask the server.
    if (Date.now() >= targetDate) {
        // Login is still required, so don't fetch until the user has logged in.
        if (loginScreen) loginScreen.style.display = "flex";
        if (countdownScreen) countdownScreen.style.display = "none";
    }

    window.myFunction = function () {
        setTimeout(function () {
            if (loader) loader.style.display = "none";
        }, 2200);
    };
})();
