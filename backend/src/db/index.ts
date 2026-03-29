import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { ENV } from "../config/env";

if(!ENV.DB_URL) {
  throw new Error("Database URL is not set in environment variables")
}

const pool = new Pool({ connectionString: ENV.DB_URL });

pool.on("connect", () => {
  console.log("Database connected successfully");
})

pool.on("error", (error) => {
  console.log("Database connection error", error);
})

export const db = drizzle({ client: pool, schema });

// a connection pool is a cache of database connections that are kept open and reused
