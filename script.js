const PLACEHOLDER_ENDPOINT = "PLACEHOLDER_BRIDGE_ENDPOINT";

const form = document.getElementById("waitlist-form");
const emailInput = document.getElementById("email");
const messageEl = document.getElementById("form-message");
const submitButton = form.querySelector(".submit-button");

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.classList.remove("is-error", "is-success");
  if (type) {
    messageEl.classList.add(type);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("", null);

  if (!emailInput.checkValidity()) {
    showMessage("Bitte eine gültige E-Mail-Adresse eintragen.", "is-error");
    emailInput.focus();
    return;
  }

  const endpoint = form.dataset.endpoint;

  if (!endpoint || endpoint === PLACEHOLDER_ENDPOINT) {
    showMessage(
      "Anmeldung ist technisch noch nicht verbunden (Bridge-Endpunkt folgt).",
      "is-error"
    );
    return;
  }

  const priceSignal = form.querySelector('input[name="PRICE_SIGNAL"]:checked');
  const honeypot = form.querySelector('input[name="website"]');

  submitButton.disabled = true;
  showMessage("Wird gesendet ...", null);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.value.trim(),
        PRICE_SIGNAL: priceSignal ? priceSignal.value : null,
        website: honeypot ? honeypot.value : "",
      }),
    });

    if (response.status === 429) {
      showMessage("Zu viele Versuche. Bitte in einer Minute nochmal.", "is-error");
      return;
    }

    if (!response.ok) {
      throw new Error("request failed");
    }

    form.reset();
    showMessage(
      "Fast geschafft. Bestätige den Link in der E-Mail, die wir dir gerade geschickt haben.",
      "is-success"
    );
  } catch (error) {
    showMessage(
      "Da ist etwas schiefgelaufen. Bitte gleich nochmal versuchen.",
      "is-error"
    );
  } finally {
    submitButton.disabled = false;
  }
});
