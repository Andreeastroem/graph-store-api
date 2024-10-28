import { driver, auth } from "neo4j-driver";

function driverUrl() {
  const url = process.env.NEO4J_URI ?? "";
  return url;
}

function authCredentials() {
  console.log("Node env:", process.env.NODE_ENV);
  if (
    process.env.NODE_ENV === "remote" ||
    process.env.NODE_ENV === "production"
  ) {
    const user = process.env.NEO4J_USER ?? "";
    const password = process.env.NEO4J_PASSWORD ?? "";

    return auth.basic(user, password);
  } else {
    return undefined;
  }
}

export const neodriver = driver(driverUrl(), authCredentials());
