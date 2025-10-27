import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { projects } from "./schema";

const dbFile = new Database("./db/database.db");
export const db = drizzle(dbFile);

export { projects };