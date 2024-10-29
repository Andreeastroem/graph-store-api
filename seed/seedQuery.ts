import seedData from "./seed.json";
// import seedData from "./tinyseed.json";

export function getSeedQuery() {
  // parse event json
  const seedQuery = seedData.map((event) => {
    let totalQuery = "";

    if (event.type === "book") {
      totalQuery += mergeBook(event.sku, event.title, event.isbn, event.pages);
    }
    totalQuery += " " + connectBookToWork(event.work.id, event.work.name);
    if (event.language) {
      totalQuery +=
        " " +
        connectBookToLanguage(
          event.language.code,
          event.language.name,
          event.language.original
        );
    }
    if (event.format) {
      totalQuery += " " + connectBookToFormat(event.format);
    }
    if (event.classifications) {
      totalQuery +=
        " " +
        event.classifications.primary
          .map((classification, idx) =>
            connectWorkToClassification(classification, true, idx)
          )
          .join(" ");
      totalQuery +=
        " " +
        event.classifications.secondary
          .map((classification, idx) =>
            connectWorkToClassification(classification, false, idx)
          )
          .join(" ");
    }
    if (event.people) {
      event.people.authors.forEach((author, idx) => {
        totalQuery += " " + connectBookToPerson(author, "WRITTEN_BY", idx);
      });
      event.people.illustrators.forEach((illustrator, idx) => {
        totalQuery +=
          " " + connectBookToPerson(illustrator, "ILLUSTRATED_BY", idx);
      });
      event.people.narrators.forEach((voiceActor, idx) => {
        totalQuery += " " + connectBookToPerson(voiceActor, "NARRATED_BY", idx);
      });
    }
    totalQuery +=
      " " + connectWorkToSeries(event.series.name, event.series.part);
    totalQuery +=
      " " +
      event.universes
        .map((universe) => connectWorkToUniverses(universe))
        .join(" ");

    totalQuery +=
      " " + connectBookToPrice(event.price.amount, event.price.currency);

    return totalQuery;
  });

  return seedQuery;
}

function mergeBook(sku: string, title: string, isbn: string, pages: number) {
  return `MERGE (b:Book {sku: "${sku}", title: "${title}", isbn: "${isbn}", pages: ${pages}})`;
}

function connectBookToPrice(amount: number, currency: string) {
  const match = `MERGE (p:Price {name: "listing"})`;
  const query = `MERGE (p)-[:COSTS {amount: ${amount}, currency: "${currency}"}]->(b)`;

  return match + " " + query;
}

function connectBookToWork(workId: string, workName: string) {
  const match = `MERGE (w:Work {id: "${workId}", title: "${workName}"})`;
  const query = `
  MERGE (b)-[:VARIANT_OFF]->(w)
  MERGE (b)<-[:VARIANT]-(w)
  `;
  return match + " " + query;
}

function connectBookToLanguage(code: string, name: string, original: boolean) {
  const bookLanguageRelationship = original ? "ORIGINAL" : "TRANSLATED_IN";
  const languageBookRelationsship = original ? "TRANSLATED" : "ORIGINAL";
  const match = `MERGE (l:Language {code: "${code}", name: "${name}"})`;
  const query = `
  MERGE (b)-[:${bookLanguageRelationship}]->(l)
  MERGE (b)<-[:${languageBookRelationsship}]-(l)
  `;
  return match + " " + query;
}

function connectBookToFormat(formatName: string) {
  const match = `MERGE (f:Format {name: "${formatName}"})`;
  const query = `
  MERGE (b)-[:IS_FORMAT]->(f)
  MERGE (b)<-[:HAS_FORMAT]-(f)
  `;

  return match + " " + query;
}

function connectWorkToClassification(
  classificationName: string,
  primary: boolean,
  idx: number
) {
  const workClassificationLabel = primary ? "IS_PRIMARILY" : "BELONGS_TO";
  const classificationWorkLabel = primary ? "PRIMARY" : "NOT_PRIMARY";
  const match = `MERGE (c${
    workClassificationLabel + idx
  }:Classification {name: "${classificationName}"})`;
  const query = `
  MERGE (w)-[:${workClassificationLabel}]->(c${workClassificationLabel + idx})
  MERGE (w)<-[:${classificationWorkLabel}]-(c${workClassificationLabel + idx})
  `;

  return match + " " + query;
}
function connectBookToPerson(
  person: { name: string; isni: string },
  relationType: "WRITTEN_BY" | "ILLUSTRATED_BY" | "NARRATED_BY",
  idx: number
) {
  const bookPersonRelationship = relationType;
  const personBookRelationship = inversePersonRelationship(relationType);
  const match = `MERGE (p${bookPersonRelationship + idx}:Person {name: "${person.name}", isni: "${person.isni}"})`;
  const query = `
    MERGE (b)-[:${bookPersonRelationship}]->(p${relationType + idx})
    MERGE (b)<-[:${personBookRelationship}]-(p${relationType + idx})
  `;

  return match + " " + query;
}
function inversePersonRelationship(
  relationType: "WRITTEN_BY" | "ILLUSTRATED_BY" | "NARRATED_BY"
) {
  switch (relationType) {
    case "WRITTEN_BY":
      return "WROTE";
    case "ILLUSTRATED_BY":
      return "ILLUSTRATED";
    case "NARRATED_BY":
      return "NARRATED";
  }
}

function connectWorkToUniverses(universeName: string) {
  const match = `MERGE (u:Universe {name: "${universeName}"})`;
  const query = `
  MERGE (w)-[:BELONGS_TO]->(u)
  MERGE (w)<-[:CONTAINS]-(u)
  `;

  return match + " " + query;
}

function connectWorkToSeries(seriesName: string, part?: number) {
  const match = `MERGE (s:Series {name: "${seriesName}"})`;
  const query = `
    MERGE (w)-[:PART_OF {part: ${part ? part : -1}}]->(s)
    MERGE (w)<-[:HAS_PART {part: ${part ? part : -1}}]-(s)
  `;

  return match + " " + query;
}
