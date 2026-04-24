import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

/**
 * Leads — submitted via the "Get a Free System Audit" CTA on the landing page.
 */
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  /** Station / business name */
  organisation: text("organisation"),
  /** State or territory, e.g. "QLD" */
  state: text("state"),
  /** Brief description of their current setup or challenge */
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
