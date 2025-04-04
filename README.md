# API-Endpunkte

## GET `/presidents`
- **Filter:**
  - `name`: Teilzeichenkette des Namens (case-insensitive)
  - `term_start`: Jahr des Amtsantritts (exakt, Format: **YYYY**, z. B. `1789`)
  - `term_end`: Jahr des Amtsendes (exakt, Format: **YYYY**, z. B. `1797`)
  - `number`: Präsidentennummer (exakt)
  - `party`: Politische Partei (exakt, z. B. "Republican")
  - `after_year`: Alle Präsidenten, die nach diesem Jahr im Amt waren (Format: **YYYY**)
  - `before_year`: Alle Präsidenten, die vor diesem Jahr im Amt waren (Format: **YYYY**)
- **Fehlerantworten:**
  - `400 Bad Request`: Bei ungültigen Filtern. Beispiel:
    ```json
    {
      "error": "Ungültige Filterparameter",
      "invalidFilters": ["color"],
      "validFilters": ["name", "term_start", ...]
    }
    ```
- **Paginierung:**
  - `page` (Standard: 1)
  - `limit` (Standard: 10)
- **Sortierung:**
  - `sort` (Standard: `number`, mögliche Werte: `name`, `term_start`, etc.)
  - `order` (Standard: `asc`, mögliche Werte: `asc`/`desc`)
- **Volltextsuche:**
  - `search`: Durchsucht alle Felder

**Beispiel:**
`/presidents?page=2&limit=5&sort=name&order=desc&search=democratic&term_start=2001`

## GET `/presidents/:query`
- Suche nach **Nummer** (z. B. `45`) oder **Namen** (z. B. `Lincoln`).

## GET `/presidents/term/:year`
- Alle Präsidenten, die im angegebenen **Jahr** (Format: **YYYY**, z. B. `2025`) im Amt waren.

## Besonderheiten

- **`term_end: "present"`**
  Wird in folgenden Fällen automatisch behandelt:
  - Bei Filtern `before_year`/`after_year` → aktuelles Jahr
  - Im Endpunkt `/presidents/term/:year` → aktuelles Jahr
  - Bei Sortierung nach `term_end` → Höchster Wert (erscheint zuerst bei `order=desc`)

- **Beispiel für Sortierung:**
  `GET /presidents?sort=term_end&order=desc` liefert aktuellen Präsidenten zuerst
