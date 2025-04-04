const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../data/presidents.json");

function readData() {
  try {
    const rawData = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(rawData);

    if (!data.presidents || !Array.isArray(data.presidents)) {
      throw new Error("Daten haben ungültiges Format");
    }

    return data;
  } catch (error) {
    console.error("Fehler:", error.message);
    return { presidents: [] };
  }
}

const getPresidents = () => readData().presidents;

const findPresident = (query) => {
  return getPresidents().find(p =>
    p.number.toString() === query ||
    p.name.toLowerCase().includes(query.toLowerCase())
  );
};

const filterPresidents = (filters, page = 1, limit = 10, sort = "number", order = "asc") => {
  let presidents = getPresidents();

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    presidents = presidents.filter(p =>
      Object.values(p).some(val =>
        val.toString().toLowerCase().includes(searchTerm)
      )
    );
    delete filters.search;
  }

  presidents = presidents.filter(president => {
    return Object.keys(filters).every(key => {
      const value = filters[key];
      if (key === "name") return president.name.toLowerCase().includes(value.toLowerCase());
      if (key === "term_start" || key === "term_end") return president[key] === value;
      if (key === "number") return president.number.toString() === value;
      if (key === "before_year") {
        const endYear = president.term_end === 'present'
          ? new Date().getFullYear()
          : parseInt(president.term_end);
        return endYear <= parseInt(value)
      }

      if (key === "after_year") {
        const endYear = president.term_end === 'present'
          ? new Date().getFullYear()
          : parseInt(president.term_end);
        return president.term_start >= parseInt(value) || endYear >= parseInt(value);
      }

      if (key === "party") return president.party.toLowerCase() === value.toLowerCase();
      return true;
    });
  });

  presidents.sort((a, b) => {
    const getEndYear = (p) => {
      if (p.term_end === 'present') return 9999;
      return parseInt(p.term_end);
    };

    const valA = sort === 'term_end' ? getEndYear(a) : a[sort];
    const valB = sort === 'term_end' ? getEndYear(b) : b[sort];

    if (order === "asc") return valA > valB ? 1 : -1;
    else return valA < valB ? 1 : -1;
  });

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return {
    data: presidents.slice(startIndex, endIndex),
    total: presidents.length,
    page,
    totalPages: Math.ceil(presidents.length / limit),
    limit,
    sort,
    order
  };
};

module.exports = { getPresidents, findPresident, filterPresidents };
