const path = require("path");
const fs = require("fs");

async function unregisterSW(page) {
    await page.evaluateOnNewDocument(() => {
        navigator.serviceWorker
            .getRegistrations()
            .then((registrations) => {
                for (let registration of registrations) {
                    registration.unregister();
                }
            })
            .catch(() => null);

        navigator.serviceWorker.register = new Promise(() => {});

        setInterval(() => {
            window.onerror = console.error;
            window.onunhandledrejection = console.error;
        }, 500);
    });
}

async function setWhatsappVer(page, version) {
    const body = fs.readFileSync(
        path.join(__dirname, "..", "..", "html", `${version}.html`)
    );
    await page.setRequestInterception(true);
    page.on("request", (req) => {
        if (req.url().startsWith("https://web.whatsapp.com/check-update")) {
            req.abort();
            return;
        }
        if (req.url() != "https://web.whatsapp.com/") {
            req.continue();
            return;
        }

        req.respond({
            status: 200,
            contentType: "text/html",
            body,
        });
    });
}

module.exports = {
    setWhatsappVer,
    unregisterSW,
};
