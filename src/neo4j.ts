import { Neo4jGraphQL } from "@neo4j/graphql";
import { neodriver } from "./db";

const typedefs = `
type Book {
	belongsToClassifications: [Classification!]! @relationship(type: "BELONGS_TO", direction: OUT)
	belongsToUniverses: [Universe!]! @relationship(type: "BELONGS_TO", direction: OUT)
	classificationsNotPrimary: [Classification!]! @relationship(type: "NOT_PRIMARY", direction: IN)
	existsInFormats: [Format!]! @relationship(type: "EXISTS_IN", direction: OUT)
	formatsHasFormat: [Format!]! @relationship(type: "HAS_FORMAT", direction: IN)
	illustratedByPeople: [Person!]! @relationship(type: "ILLUSTRATED_BY", direction: OUT)
	isbn: String!
	languagesOriginal: [Language!]! @relationship(type: "ORIGINAL", direction: IN)
	languagesTranslated: [Language!]! @relationship(type: "TRANSLATED", direction: IN)
	narratedByPeople: [Person!]! @relationship(type: "NARRATED_BY", direction: OUT)
	originalLanguages: [Language!]! @relationship(type: "ORIGINAL", direction: OUT)
	pages: BigInt!
	partOfSeries: [Series!]! @relationship(type: "PART_OF", direction: OUT)
	peopleIllustrated: [Person!]! @relationship(type: "ILLUSTRATED", direction: IN)
	peopleNarrated: [Person!]! @relationship(type: "NARRATED", direction: IN)
	peopleWrote: [Person!]! @relationship(type: "WROTE", direction: IN)
	pricesCosts: [Price!]! @relationship(type: "COSTS", direction: IN, properties: "CostsProperties")
	seriesHasPart: [Series!]! @relationship(type: "HAS_PART", direction: IN)
	sku: String!
	title: String!
	translatedInLanguages: [Language!]! @relationship(type: "TRANSLATED_IN", direction: OUT)
	universesContains: [Universe!]! @relationship(type: "CONTAINS", direction: IN)
	variantOffWorks: [Work!]! @relationship(type: "VARIANT_OFF", direction: OUT)
	worksVariant: [Work!]! @relationship(type: "VARIANT", direction: IN)
	writtenByPeople: [Person!]! @relationship(type: "WRITTEN_BY", direction: OUT)
}

type Classification {
	booksBelongsTo: [Book!]! @relationship(type: "BELONGS_TO", direction: IN)
	name: String!
	notPrimaryBooks: [Book!]! @relationship(type: "NOT_PRIMARY", direction: OUT)
}

type CostsProperties @relationshipProperties {
	amount: Float!
	currency: String!
}

type Format {
	booksExistsIn: [Book!]! @relationship(type: "EXISTS_IN", direction: IN)
	hasFormatBooks: [Book!]! @relationship(type: "HAS_FORMAT", direction: OUT)
	name: String!
}

type Language {
	booksOriginal: [Book!]! @relationship(type: "ORIGINAL", direction: IN)
	booksTranslatedIn: [Book!]! @relationship(type: "TRANSLATED_IN", direction: IN)
	code: String!
	name: String!
	originalBooks: [Book!]! @relationship(type: "ORIGINAL", direction: OUT)
	translatedBooks: [Book!]! @relationship(type: "TRANSLATED", direction: OUT)
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
	booksPartOf: [Book!]! @relationship(type: "PART_OF", direction: IN)
	hasPartBooks: [Book!]! @relationship(type: "HAS_PART", direction: OUT)
	name: String!
	part: BigInt!
}

type Universe {
	booksBelongsTo: [Book!]! @relationship(type: "BELONGS_TO", direction: IN)
	containsBooks: [Book!]! @relationship(type: "CONTAINS", direction: OUT)
	name: String!
}

type Work {
	booksVariantOff: [Book!]! @relationship(type: "VARIANT_OFF", direction: IN)
	id: String!
	title: String!
	variantBooks: [Book!]! @relationship(type: "VARIANT", direction: OUT)
}
`;

export const neoSchema = new Neo4jGraphQL({
  typeDefs: typedefs,
  driver: neodriver,
});
