import { toGraphQLTypeDefs } from "@neo4j/introspector";
import { writeFileSync } from "fs";
import { neodriver } from "./db";

async function generateTypeSchema() {
  try {
    const sessionFactory = () =>
      neodriver.session({ defaultAccessMode: "READ" });
    const typeDefs = await toGraphQLTypeDefs(sessionFactory);
    writeFileSync("src/typeDefs.graphql", typeDefs);
    await neodriver.close();
  } catch (error) {
    console.error(error);
  }
}

generateTypeSchema();
