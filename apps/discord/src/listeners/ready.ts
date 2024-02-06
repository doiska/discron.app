import { Events, Listener, container } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import type { Client } from "discord.js";
import { parseScheduledEvent } from "../helpers/parse-scheduled-event.ts";
import { kil } from "../database/kil.ts";
import { scheduledEvents } from "@discron/shared"
import { sql } from "drizzle-orm";

@ApplyOptions<Listener.Options>({
    name: "guildScheduledEventUpdate",
    event: Events.ClientReady,
})
export class ReadyEvent extends Listener<typeof Events.ClientReady> {
    public async run(client: Client) {

        console.log("Locked and loaded!");

        // fetch all guilds
        const guilds = client.guilds.cache;

        // loop through each guild
        for (const guild of guilds.values()) {

            const events = await guild.scheduledEvents.fetch();

            const parsedEvents = events.map(parseScheduledEvent);

            const parsedEventsPromises = parsedEvents.map(async event => {
                const invitableChannelResolvable = event.location?.type === "channel" ? event.location.id : guild.systemChannelId;

                const inviteUrl = await (async () => {
                    if (!invitableChannelResolvable) {
                        return null;
                    }

                    const invites = await guild.invites.fetch()
                        .then(i => i.find(i => i.inviter?.id === client.user?.id));

                    if (invites) {
                        return invites.url;
                    }

                    return await guild.invites.create(invitableChannelResolvable, {
                        temporary: false
                    }).then(i => i.url);
                })();

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
                    name: sql`excluded.name`,
                    description: sql`excluded.description`,
                    url: sql`excluded.url`,
                    status: sql`excluded.status`,
                    image: sql`excluded.image`,
                    subscribers: sql`excluded.subscribers`,
                    startsAt: sql`excluded.starts_at`,
                    endsAt: sql`excluded.ends_at`,
                    location: sql`excluded.location`,
                    updatedAt: sql`now()`,
                },
                target: [scheduledEvents.id],
            });
        }

        const result = await kil.select().from(scheduledEvents);

        console.log(result);
    }
}

void container.stores.loadPiece({
    name: "guildScheduledEventUpdate",
    store: "listeners",
    piece: ReadyEvent,
})
