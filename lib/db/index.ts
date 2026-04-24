import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

function getConnectionString() {
	const raw =
		process.env.DATABASE_URL_UNPOOLED ??
		process.env.POSTGRES_URL_NON_POOLING ??
		process.env.DATABASE_URL ??
		process.env.POSTGRES_URL

	if (!raw) {
		throw new Error("Missing database connection string")
	}

	const url = new URL(raw)
	// Avoid forcing channel binding in local/runtime environments.
	url.searchParams.delete("channel_binding")
	return url.toString()
}

const globalForDb = globalThis as unknown as { pgPool?: Pool }

const pool =
	globalForDb.pgPool ??
	new Pool({
		connectionString: getConnectionString(),
		ssl: { rejectUnauthorized: false },
	})

if (process.env.NODE_ENV !== "production") {
	globalForDb.pgPool = pool
}

export const db = drizzle(pool, { schema })
