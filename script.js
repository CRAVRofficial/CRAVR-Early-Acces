const PLACEHOLDER_ACTION = "PLACEHOLDER_BREVO_FORM_ACTION";

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

  const formAction = form.dataset.formAction;

  if (!formAction || formAction === PLACEHOLDER_ACTION) {
    showMessage(
      "Anmeldung ist technisch noch nicht verbunden (Formular-Anbindung folgt).",
      "is-error"
    );
    return;
  }

  submitButton.disabled = true;
  showMessage("Wird gesendet ...", null);

  // Brevo-Signup-Formulare unterstützen kein CORS mit lesbarer Antwort,
  // daher "no-cors": Anfrage geht raus, das Ergebnis kann nicht ausgelesen werden.
  // Feldnamen (z. B. "EMAIL" statt "email") müssen exakt an das echte,
  // in Brevo erstellte Formular angepasst werden, sobald es existiert.
  try {
    await fetch(formAction, {
      method: "POST",
      mode: "no-cors",
      body: new FormData(form),
    });
    form.reset();
    showMessage("Danke. Du bist auf der Liste.", "is-success");
  } catch (error) {
    showMessage(
      "Da ist etwas schiefgelaufen. Bitte gleich nochmal versuchen.",
      "is-error"
    );
  } finally {
    submitButton.disabled = false;
  }
});
