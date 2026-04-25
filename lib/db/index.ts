import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

function getConnectionString() {
	const raw =
		process.env.DATABASE_URL ??
		process.env.POSTGRES_URL

	if (!raw) {
		throw new Error("Missing database connection string")
	}

	return raw
}

const sql = neon(getConnectionString())

export const db = drizzle(sql, { schema })
