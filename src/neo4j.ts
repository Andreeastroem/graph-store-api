import { Neo4jGraphQL } from "@neo4j/graphql";
import { neodriver } from "./db";

const typedefs = `
type Book {
	formatsHasFormat: [Format!]! @relationship(type: "HAS_FORMAT", direction: IN)
	illustratedByPeople: [Person!]! @relationship(type: "ILLUSTRATED_BY", direction: OUT)
	isFormatFormats: [Format!]! @relationship(type: "IS_FORMAT", direction: OUT)
	isbn: String!
	languagesOriginal: [Language!]! @relationship(type: "ORIGINAL", direction: IN)
	languagesTranslated: [Language!]! @relationship(type: "TRANSLATED", direction: IN)
	narratedByPeople: [Person!]! @relationship(type: "NARRATED_BY", direction: OUT)
	originalLanguages: [Language!]! @relationship(type: "ORIGINAL", direction: OUT)
	pages: BigInt!
	peopleIllustrated: [Person!]! @relationship(type: "ILLUSTRATED", direction: IN)
	peopleNarrated: [Person!]! @relationship(type: "NARRATED", direction: IN)
	peopleWrote: [Person!]! @relationship(type: "WROTE", direction: IN)
	pricesCosts: [Price!]! @relationship(type: "COSTS", direction: IN, properties: "CostsProperties")
	sku: String!
	title: String!
	translatedInLanguages: [Language!]! @relationship(type: "TRANSLATED_IN", direction: OUT)
	variantOffWorks: [Work!]! @relationship(type: "VARIANT_OFF", direction: OUT)
	worksVariant: [Work!]! @relationship(type: "VARIANT", direction: IN)
	writtenByPeople: [Person!]! @relationship(type: "WRITTEN_BY", direction: OUT)
}

type Classification {
	name: String!
	notPrimaryWorks: [Work!]! @relationship(type: "NOT_PRIMARY", direction: OUT)
	primaryWorks: [Work!]! @relationship(type: "PRIMARY", direction: OUT)
	worksBelongsTo: [Work!]! @relationship(type: "BELONGS_TO", direction: IN)
	worksIsPrimarily: [Work!]! @relationship(type: "IS_PRIMARILY", direction: IN)
}

type CostsProperties @relationshipProperties {
	amount: Float!
	currency: String!
}

type Format {
	booksIsFormat: [Book!]! @relationship(type: "IS_FORMAT", direction: IN)
	hasFormatBooks: [Book!]! @relationship(type: "HAS_FORMAT", direction: OUT)
	name: String!
}

type HasPartProperties @relationshipProperties {
	part: BigInt!
}

type Language {
	booksOriginal: [Book!]! @relationship(type: "ORIGINAL", direction: IN)
	booksTranslatedIn: [Book!]! @relationship(type: "TRANSLATED_IN", direction: IN)
	code: String!
	name: String!
	originalBooks: [Book!]! @relationship(type: "ORIGINAL", direction: OUT)
	translatedBooks: [Book!]! @relationship(type: "TRANSLATED", direction: OUT)
}

type PartOfProperties @relationshipProperties {
	part: BigInt!
}

type Person {
	booksIllustratedBy: [Book!]! @relationship(type: "ILLUSTRATED_BY", direction: IN)
	booksNarratedBy: [Book!]! @relationship(type: "NARRATED_BY", direction: IN)
	booksWrittenBy: [Book!]! @relationship(type: "WRITTEN_BY", direction: IN)
	illustratedBooks: [Book!]! @relationship(type: "ILLUSTRATED", direction: OUT)
	isni: String!
	name: String!
	narratedBooks: [Book!]! @relationship(type: "NARRATED", direction: OUT)
	wroteBooks: [Book!]! @relationship(type: "WROTE", direction: OUT)
}

type Price {
	costsBooks: [Book!]! @relationship(type: "COSTS", direction: OUT, properties: "CostsProperties")
	name: String!
}

type Series {
	hasPartWorks: [Work!]! @relationship(type: "HAS_PART", direction: OUT, properties: "HasPartProperties")
	name: String!
	worksPartOf: [Work!]! @relationship(type: "PART_OF", direction: IN, properties: "PartOfProperties")
}

type Universe {
	containsWorks: [Work!]! @relationship(type: "CONTAINS", direction: OUT)
	name: String!
	worksBelongsTo: [Work!]! @relationship(type: "BELONGS_TO", direction: IN)
}

type Work {
	belongsToClassifications: [Classification!]! @relationship(type: "BELONGS_TO", direction: OUT)
	belongsToUniverses: [Universe!]! @relationship(type: "BELONGS_TO", direction: OUT)
	booksVariantOff: [Book!]! @relationship(type: "VARIANT_OFF", direction: IN)
	classificationsNotPrimary: [Classification!]! @relationship(type: "NOT_PRIMARY", direction: IN)
	classificationsPrimary: [Classification!]! @relationship(type: "PRIMARY", direction: IN)
	id: String!
	isPrimarilyClassifications: [Classification!]! @relationship(type: "IS_PRIMARILY", direction: OUT)
	partOfSeries: [Series!]! @relationship(type: "PART_OF", direction: OUT, properties: "PartOfProperties")
	seriesHasPart: [Series!]! @relationship(type: "HAS_PART", direction: IN, properties: "HasPartProperties")
	title: String!
	universesContains: [Universe!]! @relationship(type: "CONTAINS", direction: IN)
	variantBooks: [Book!]! @relationship(type: "VARIANT", direction: OUT)
}
`;

export const neoSchema = new Neo4jGraphQL({
  typeDefs: typedefs,
  driver: neodriver,
});
