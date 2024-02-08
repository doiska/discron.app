import { Events, Listener, container } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import type { Client } from "discord.js";
import { parseScheduledEvent } from "../helpers/parse-scheduled-event.ts";
import { kil } from "../database/kil.ts";
import { scheduledEvents, guilds as guildsSchema } from "@discron/shared"
import { sql } from "drizzle-orm";

@ApplyOptions<Listener.Options>({
    name: "guildScheduledEventUpdate",
    event: Events.ClientReady,
})
export class ReadyEvent extends Listener<typeof Events.ClientReady> {
    public async run(client: Client) {
        console.log("Locked and loaded!");

        const guilds = client.guilds.cache;

        for (const guild of guilds.values()) {
            await kil.insert(guildsSchema)
                .values({
                    id: guild.id,
                    name: guild.name,
                    banner: guild.bannerURL({ extension: "webp", size: 2048 }),
                    icon: guild.iconURL({ extension: "webp", size: 2048 }),
                    splash: guild.splashURL({ extension: "webp", size: 2048 }),
                })
                .onConflictDoUpdate({
                    set: {
                        name: sql.raw("excluded.name"),
                        icon: sql.raw("excluded.icon"),
                        banner: sql.raw("excluded.banner"),
                        splash: sql.raw("excluded.splash"),
                        updatedAt: sql.raw("now()"),
                    },
                    target: [guildsSchema.id],
                })

            const events = await guild.scheduledEvents.fetch();

            const parsedEvents = events.map(parseScheduledEvent);

            const parsedEventsPromises = parsedEvents.map(async event => {
                const invitableChannelResolvable = event.location?.type === "channel" ? event.location.id : guild.systemChannelId;

                const inviteUrl = await (async () => {
                    if (!invitableChannelResolvable) {
                        return null;
                    }

                    const invites = await guild.invites.fetch()
                        .then(i => i.find(i => i.inviter?.id === client.user?.id))

                    if (invites) {
                        return invites.url;
                    }

                    return await guild.invites.create(invitableChannelResolvable, {
                        temporary: false
                    })
                        .then(i => i.url)
                })().catch(() => null);

                return {
                    id: event.id,
                    guildId: guild.id,
                    name: event.name,
                    description: event.description,
                    url: inviteUrl,
                    access: event.access ? "public" : "guild-only",
                    status: event.status,
                    creator: event.creator,
                    image: event.image,
                    subscribers: event.subscribers.count ?? 0,
                    startsAt: event.startsAt,
                    endsAt: event.endsAt,
                    location: event.location,
                    createdAt: event.createdAt,
                }
            });

            const insertEvents = await Promise.all(parsedEventsPromises);

            await kil.insert(scheduledEvents).values(insertEvents).onConflictDoUpdate({
                set: {
                    name: sql.raw("excluded.name"),
                    description: sql.raw("excluded.description"),
                    url: sql.raw("excluded.url"),
                    status: sql.raw("excluded.status"),
                    image: sql.raw("excluded.image"),
                    subscribers: sql.raw("excluded.subscribers"),
                    startsAt: sql.raw("excluded.starts_at"),
                    endsAt: sql.raw("excluded.ends_at"),
                    location: sql.raw("excluded.location"),
                    updatedAt: sql.raw("now()"),
                },
                target: [scheduledEvents.id],
            });
        }
    }
}

void container.stores.loadPiece({
    name: "guildScheduledEventUpdate",
    store: "listeners",
    piece: ReadyEvent,
})
