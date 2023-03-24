import { Pool } from "pg";

let conn: Pool;

if (!conn) {
  console.log("Connecting to database...");
  conn = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
  });
}

export default conn;
