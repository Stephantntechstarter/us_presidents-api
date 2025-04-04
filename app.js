const express = require("express");
const { getPresidents, findPresident, filterPresidents } = require("./utils/db");
const { createError } = require('./utils/errors');
const app = express();

app.use(express.json());

const validateFilters = (req, res, next) => {
  const validFilters = ["name", "term_start", "term_end", "number", "party",
    "after_year", "before_year", "page", "limit", "sort", "order", "search"
  ];

  const invalidFilters = Object.keys(req.query).filter(key => !validFilters.includes(key));

  if (invalidFilters.length > 0) {
    return res.status(400).json(
      createError(400, "Ungültige Filterparameter", {
        invalidFilters,
        validFilters,
      })
    );
  }
  next();
};

app.get("/presidents", validateFilters, (req, res) => {
  const filters = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || "number";
  const order = req.query.order || "asc";

  const result = filterPresidents(filters, page, limit, sort, order);
  res.json(result);
});

app.get("/presidents/:query", (req, res) => {
  const president = findPresident(req.params.query);
  if (!president) {
    return res.status(404).json(
      createError(404, "Präsident nicht gefunden", {
        query: req.params.query,
        tip: "Nutze die Nummer (1-47) oder einen Namensteil."
      })
    );
  }
  res.json(president);
});

app.get("/presidents/term/:year", (req, res) => {
  const year = parseInt(req.params.year);
  const currentYear = new Date().getFullYear();

  if (isNaN(year) || req.params.year.length !== 4) {
    return res.status(400).json(
      createError(400, "Ungültiges Jahr", {
        received: year,
        expected: "JJJJ-Format (z. B. 2024)"
      })
    );
  }

  if (year > currentYear) {
    return res.status(400).json(
      createError(400, 'Jahr liegt in der Zukunft', {
        received: year,
        maxYear: currentYear
      })
    );
  }

  const presidents = getPresidents().filter(p => {
    const endYear = p.term_end === 'present' ? currentYear : p.term_end;
    return p.term_start <= year && endYear >= year;
  });

  res.json(presidents);
});

// Error-Handler für unerwartete Fehler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(
    createError(500, "Interner Serverfehler", {
      requestId: req.id,
      endpoint: req.originalUrl
    })
  );
});

module.exports = app;
