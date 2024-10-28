import fastify from "fastify";
import mercurius from "mercurius";
import { neoSchema } from "./neo4j";

const app = fastify({ logger: true });

async function main() {
  console.log("running main...");
  const port = process.env.PORT || "4000";
  console.log("port to listen to:", port);
  try {
    const schema = await neoSchema.getExecutableSchema();

    app.register(mercurius, {
      schema,
      graphiql: true,
    });

    app.listen({ port: parseInt(port), host: "0.0.0.0" });
  } catch (error) {
    console.error(error);
  }
}

main();
