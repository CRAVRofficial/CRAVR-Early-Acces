# Bridge – Formular zu Brevo

Kleine Cloudflare-Worker-Funktion, die die Warteliste-Anmeldung (E-Mail + optionale Preis-Angabe) von `index.html` entgegennimmt und sicher in Brevo einträgt (Liste "CRAVR Early Access", ID 5). Der Brevo-API-Schlüssel steht dabei nie im Website-Code, sondern nur in dieser Funktion, als geschütztes "Secret".

## Einmalige Einrichtung (Bennett, ca. 10 Minuten)

1. Kostenloses Konto auf [dash.cloudflare.com](https://dash.cloudflare.com) anlegen (falls noch nicht vorhanden).
2. Im Dashboard: **Workers & Pages → Create → Worker** → einen Namen vergeben (z. B. `cravr-waitlist-bridge`).
3. Den Inhalt von `worker.js` (in diesem Ordner) in den Worker-Editor einfügen, speichern/deployen.
4. Im Worker unter **Settings → Variables and Secrets**: neues **Secret** anlegen, Name `BREVO_API_KEY`, Wert = der Brevo-API-Schlüssel (siehe [[KI - Claude Code Setup]], Abschnitt "Konkret lohnende Aufwertung: Brevo" für den Weg, ihn in Brevo zu erzeugen). Wichtig: als **Secret**, nicht als normale Variable, damit der Wert nirgends im Klartext sichtbar ist.
5. In Brevo unter **Kontakte → Einstellungen → Kontaktattribute** ein neues Attribut anlegen: Name `PRICE_SIGNAL`, Typ "Text" (falls noch nicht vorhanden – aktuell noch nicht angelegt, Stand 27.07.2026).
6. Die fertige Worker-Adresse (z. B. `https://cravr-waitlist-bridge.<dein-name>.workers.dev`) mir schicken.

## Danach (übernimmt die KI)

`PLACEHOLDER_BRIDGE_ENDPOINT` in `../index.html` und `../script.js` durch die echte Worker-Adresse ersetzen, testen, Sicherheits-Review, Push.

## Warum Cloudflare Workers statt GitHub Pages

GitHub Pages liefert nur fertige Dateien aus, kann aber keinen eigenen Code ausführen (keine Serverfunktion). Cloudflare Workers ist kostenlos und genau dafür gemacht: ein winziges Stück Code, das im Hintergrund läuft und den Brevo-Schlüssel sicher verwahrt. Die eigentliche Seite bleibt unverändert auf GitHub Pages.
