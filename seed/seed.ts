import { exit } from "process";
import { neodriver } from "../src/db";
import { getSeedQuery } from "./seedQuery";

(async () => {
  try {
    const queries = getSeedQuery();
    const session = neodriver.session({ database: "neo4j" });
    // Clear the database
    console.log("Clearing database...");
    await session.executeWrite(async (tx) => {
      return await tx.run("DROP INDEX workTitles IF EXISTS", {
        database: "neo4j",
      });
    });
    await session.executeWrite(async (tx) => {
      return await tx.run("MATCH (n) DETACH DELETE n", {
        database: "neo4j",
      });
    });
    console.log("Cleared");

    console.log("Creating constraints...");
    await session.executeWrite(async (tx) => {
      return await tx.run(
        "CREATE CONSTRAINT IF NOT EXISTS FOR (w:Work) REQUIRE w.id IS UNIQUE",
        { database: "neo4j" }
      );
    });
    await session.executeWrite(async (tx) => {
      return await tx.run(
        "CREATE CONSTRAINT IF NOT EXISTS FOR (l:Language) REQUIRE l.name IS UNIQUE",
        { database: "neo4j" }
      );
    });
    await session.executeWrite(async (tx) => {
      return await tx.run(
        "CREATE CONSTRAINT IF NOT EXISTS FOR (classification:Classification) REQUIRE classification.name IS UNIQUE",
        { database: "neo4j" }
      );
    });
    console.log("Constraints created");

    // Seed the database
    console.log("Seeding database...");
    const result = queries.map(async (query) => {
      const session = neodriver.session({ database: "neo4j" });
      try {
        return await session.executeWrite(async (tx) => {
          return await tx.run(query);
        });
      } catch (error) {
        console.error("Error running query: ", query, error);
        return null;
      } finally {
        await session.close();
      }
    });

    await Promise.all(result).then((res) => {
      if (res.length > 0) {
        res.forEach((r) => {
          // console.log("Query result: ", r);
        });
      }
    });
    console.log("Seeding completed");

    console.log("Creating fulltext index...");
    await session.executeWrite(async (tx) => {
      return await tx.run(
        "CREATE FULLTEXT INDEX workTitles IF NOT EXISTS FOR (w:Work) ON EACH [w.title, w.sku]",
        { database: "neo4j" }
      );
    });
    console.log("Fulltext index created");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  } finally {
    await neodriver.close();
  }
  exit();
})();
