# Bridge, Formular zu Brevo

Kleine Cloudflare-Worker-Funktion, die die Warteliste-Anmeldung (E-Mail plus optionale Preis-Angabe) von `index.html` entgegennimmt und sicher in Brevo einträgt (Liste "CRAVR Early Access", ID 5). Der Brevo-API-Schlüssel steht dabei nie im Website-Code, sondern nur in dieser Funktion, als geschütztes "Secret".

## Stand: vollständig eingerichtet (2026-08-26)

Alles läuft, per Selbsttest bestätigt. Der Worker antwortet unter `https://cravr-warteliste.cravr-official.workers.dev` mit:

```json
{"version":"2026-08-26-secure2","has_brevo_key":true,"doi_template":"6","has_rate_limit":true}
```

Erledigt:

- Brevo-Schlüssel als Secret hinterlegt, Liste 5 und Attribut `PRICE_SIGNAL` vorhanden
- KV-Speicher `cravr-rate-limit` angelegt und als `RATE_LIMIT` verknüpft
- `BREVO_DOI_TEMPLATE_ID` = 6 (CRAVR-Design), `BREVO_DOI_REDIRECT_URL` auf die Dankeseite
- Domain `cravr.de` ist bei Brevo vollständig beglaubigt (DKIM 1 und 2, DMARC, Marken-Eintrag), im DNS geprüft
- End-to-End getestet: Anmeldung ausgelöst, Bestätigungsmail kam an, fremde Herkunft wird mit 403 abgewiesen, Honeypot verwirft Bot-Versuche still

**Zwei Stolpersteine, die beim Testen Zeit gekostet haben und hier festgehalten sind:**

1. **Der Mailversand kann mehrere Minuten dauern.** Ein Test gilt nicht als gescheitert, nur weil nach zwei Minuten nichts da ist.
2. **Gmails Suche `newer_than:1d` rundet auf Kalendertage** und übersieht dabei frische Mails. Beim Nachprüfen besser `newer_than:3d` verwenden oder direkt im Postfach schauen.

Eine dritte Fehlspur war die Annahme, die Domain sei nicht beglaubigt. Ursache war eine Abfrage der falschen Eintragsnamen: Brevo nutzt `brevo1._domainkey` und `brevo2._domainkey`, nicht das übliche `mail._domainkey`.

## Was der Worker prüft, bevor er etwas einträgt

Vier Stufen, absichtlich hintereinander:

1. **Herkunftsprüfung.** Nur Anfragen von den in `ALLOWED_ORIGINS` eingetragenen Adressen werden angenommen. Wichtig zu verstehen: Die früher allein vorhandene CORS-Regel ist kein Schutz, denn CORS ist nur eine Regel, an die sich Browser halten. Ein Skript umgeht sie. Deshalb wird die Herkunft jetzt zusätzlich im Worker selbst geprüft.
2. **Honeypot.** Das Formular enthält ein Feld, das für Menschen unsichtbar ist. Füllt es jemand aus, war es ein Bot. Der Worker antwortet dann trotzdem freundlich, damit der Bot nicht merkt, dass er erkannt wurde.
3. **Begrenzung pro Absender.** Höchstens 5 Versuche je IP-Adresse in 5 Minuten. Verhindert, dass jemand die Liste per Skript mit tausenden Adressen flutet.
4. **Doppelte Bestätigung (Double Opt-in).** Der Kontakt landet erst nach einem Klick in der Bestätigungsmail auf der Liste. Das verhindert, dass jemand fremde Adressen einträgt, und ist gleichzeitig der Einwilligungsnachweis nach Art. 7 DSGVO.

## Wie es eingerichtet wurde (zum Nachvollziehen)

Diese Schritte sind bereits erledigt, hier nur dokumentiert, falls etwas neu aufgesetzt werden muss.

**KV-Speicher fuer die Anfragebegrenzung.** KV ist ein einfacher Speicher bei Cloudflare, in dem sich der Worker merkt, wie oft eine IP-Adresse es schon versucht hat, wie ein Strichlisten-Zettel neben der Tuer. Angelegt als `cravr-rate-limit`, im Worker unter Settings, Bindings als KV Namespace mit dem Variablennamen `RATE_LIMIT` verknuepft.

**Bestaetigungsmail.** Vorlage "CRAVR Early Access - Anmeldung bestaetigen (DOI)", Nummer 6, im CRAVR-Design statt im blauen Brevo-Standard, Absender `info@cravr.de`. Im Worker als zwei normale Variablen hinterlegt (keine Secrets noetig, das sind keine Geheimnisse):

- `BREVO_DOI_TEMPLATE_ID`, Wert `6`
- `BREVO_DOI_REDIRECT_URL`, Wert `https://cravrofficial.github.io/CRAVR-Early-Acces/danke.html`, nach dem Domain-Umzug `https://early.cravr.de/danke.html`

Fehlen diese beiden Werte, traegt der Worker Kontakte direkt ein, ohne Bestaetigungsschritt. Das ist der Rueckfallweg und fuer den Livegang nicht ausreichend.

## Selbsttest

Ein einfacher Aufruf der Worker-Adresse im Browser zeigt den Zustand:

```
https://cravr-warteliste.cravr-official.workers.dev
```

Antwort bei vollständiger Einrichtung:

```json
{
  "version": "2026-08-26-secure2",
  "has_brevo_key": true,
  "doi_template": "6",
  "has_rate_limit": true
}
```

Steht `has_brevo_key` oder `has_rate_limit` auf `false`, oder ist `doi_template` leer, fehlt der zugehörige Schritt oben.

## Bei Umzug auf die eigene Domain

Wechselt die Seite auf `early.cravr.de`, ist im Worker nichts mehr zu ändern. Diese Adresse steht bereits in `ALLOWED_ORIGINS`, die alte GitHub-Adresse bleibt zusätzlich erlaubt.

## Warum Cloudflare Workers statt GitHub Pages

GitHub Pages liefert nur fertige Dateien aus, kann aber keinen eigenen Code ausführen. Cloudflare Workers ist kostenlos und genau dafür gemacht: ein winziges Stück Code, das im Hintergrund läuft und den Brevo-Schlüssel sicher verwahrt. Die eigentliche Seite bleibt unverändert auf GitHub Pages.
