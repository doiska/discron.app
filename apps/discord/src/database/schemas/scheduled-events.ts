import {pgTable, varchar} from "drizzle-orm/pg-core";

export const scheduledEvents = pgTable("scheduledEvents", {
    id: varchar("id")
        .notNull()
        .primaryKey(),
    guildId: varchar("guild_id")
        .notNull(),
    name: varchar("name"),
    creator: varchar("creator"),
})
