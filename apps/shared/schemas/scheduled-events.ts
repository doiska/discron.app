import { integer, jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const guilds = pgTable("guilds", {
    id: varchar("id")
        .notNull()
        .primaryKey(),
    name: varchar("name").notNull(),
    icon: varchar("icon"),
    banner: varchar("banner"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
})

export const scheduledEvents = pgTable("scheduled_events", {
    id: varchar("id")
        .notNull()
        .primaryKey(),
    guildId: varchar("guild_id")
        .notNull(),
    name: varchar("name").notNull(),
    description: varchar("description"),
    url: varchar("url"),
    access: varchar("access").default("public"),
    status: varchar("status").default("unknown"),
    creator: jsonb("creator").$type<{ id: string, name: string, image?: string | null, type: string | "user" | "guild" }>(),
    image: varchar("image"),
    location: jsonb("location").$type<{ id: string, name: string, type: string | "raw" | "channel" }>(),
    subscribers: integer("subscribers").default(0),
    startsAt: timestamp("starts_at"),
    endsAt: timestamp("ends_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
})
