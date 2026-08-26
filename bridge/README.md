# Bridge, Formular zu Brevo

Kleine Cloudflare-Worker-Funktion, die die Warteliste-Anmeldung (E-Mail plus optionale Preis-Angabe) von `index.html` entgegennimmt und sicher in Brevo einträgt (Liste "CRAVR Early Access", ID 5). Der Brevo-API-Schlüssel steht dabei nie im Website-Code, sondern nur in dieser Funktion, als geschütztes "Secret".

## Stand

Grundeinrichtung ist erledigt und am 2026-08-26 geprüft: Der Worker läuft unter `https://cravr-warteliste.cravr-official.workers.dev`, der Brevo-Schlüssel ist hinterlegt, Liste 5 und das Attribut `PRICE_SIGNAL` existieren.

Offen sind die beiden Punkte unter "Noch einzurichten".

## Was der Worker prüft, bevor er etwas einträgt

Vier Stufen, absichtlich hintereinander:

1. **Herkunftsprüfung.** Nur Anfragen von den in `ALLOWED_ORIGINS` eingetragenen Adressen werden angenommen. Wichtig zu verstehen: Die früher allein vorhandene CORS-Regel ist kein Schutz, denn CORS ist nur eine Regel, an die sich Browser halten. Ein Skript umgeht sie. Deshalb wird die Herkunft jetzt zusätzlich im Worker selbst geprüft.
2. **Honeypot.** Das Formular enthält ein Feld, das für Menschen unsichtbar ist. Füllt es jemand aus, war es ein Bot. Der Worker antwortet dann trotzdem freundlich, damit der Bot nicht merkt, dass er erkannt wurde.
3. **Begrenzung pro Absender.** Höchstens 5 Versuche je IP-Adresse in 5 Minuten. Verhindert, dass jemand die Liste per Skript mit tausenden Adressen flutet.
4. **Doppelte Bestätigung (Double Opt-in).** Der Kontakt landet erst nach einem Klick in der Bestätigungsmail auf der Liste. Das verhindert, dass jemand fremde Adressen einträgt, und ist gleichzeitig der Einwilligungsnachweis nach Art. 7 DSGVO.

## Noch einzurichten (Bennett, ca. 10 Minuten)

### 1. Speicher für die Anfragebegrenzung (KV)

KV ist ein einfacher Speicher bei Cloudflare, in dem sich der Worker merkt, wie oft eine IP-Adresse es schon versucht hat. Wie ein Strichlisten-Zettel neben der Tür.

1. Auf [dash.cloudflare.com](https://dash.cloudflare.com) einloggen.
2. Links im Menü **Storage & Databases** öffnen, dort **KV** wählen.
3. Auf **Create Instance** klicken, als Namen `cravr-rate-limit` eintragen, bestätigen.
4. Zurück zum Worker `cravr-warteliste`, dort **Settings** öffnen, Abschnitt **Bindings**.
5. **Add binding** wählen, Typ **KV Namespace**. Bei "Variable name" exakt `RATE_LIMIT` eintragen (Großbuchstaben, mit Unterstrich), bei "KV namespace" den eben erstellten `cravr-rate-limit` auswählen. Speichern.

Ohne diesen Schritt funktioniert die Anmeldung weiterhin, nur die Begrenzung greift nicht.

### 2. Bestätigungsmail (Double Opt-in)

Die Vorlage ist bereits angelegt: "CRAVR Early Access - Anmeldung bestaetigen (DOI)", **Vorlagen-Nummer 6**, im CRAVR-Design statt im blauen Brevo-Standard. Absender ist `info@cravr.de`. Es fehlt nur noch, sie dem Worker bekannt zu machen:

1. Im Worker unter **Settings → Variables and Secrets** zwei normale Variablen anlegen (keine Secrets nötig, das sind keine Geheimnisse):
   - `BREVO_DOI_TEMPLATE_ID`, Wert: `6`
   - `BREVO_DOI_REDIRECT_URL`, Wert: die Adresse der Dankeseite, also `https://cravrofficial.github.io/CRAVR-Early-Acces/danke.html` beziehungsweise nach dem Domain-Umzug `https://early.cravr.de/danke.html`
2. Speichern und den Worker erneut deployen.

Solange diese beiden Werte fehlen, trägt der Worker Kontakte direkt ein, ohne Bestätigungsschritt. Das ist der Rückfallweg und für den Livegang nicht ausreichend.

## Selbsttest

Ein einfacher Aufruf der Worker-Adresse im Browser zeigt den Zustand:

```
https://cravr-warteliste.cravr-official.workers.dev
```

Antwort bei vollständiger Einrichtung:

```json
{
  "version": "2026-08-26-secure1",
  "has_brevo_key": true,
  "has_doi_template": true,
  "has_rate_limit": true
}
```

Steht bei einem der drei Werte `false`, fehlt der zugehörige Schritt oben.

## Bei Umzug auf die eigene Domain

Wechselt die Seite auf `early.cravr.de`, ist im Worker nichts mehr zu ändern. Diese Adresse steht bereits in `ALLOWED_ORIGINS`, die alte GitHub-Adresse bleibt zusätzlich erlaubt.

## Warum Cloudflare Workers statt GitHub Pages

GitHub Pages liefert nur fertige Dateien aus, kann aber keinen eigenen Code ausführen. Cloudflare Workers ist kostenlos und genau dafür gemacht: ein winziges Stück Code, das im Hintergrund läuft und den Brevo-Schlüssel sicher verwahrt. Die eigentliche Seite bleibt unverändert auf GitHub Pages.
