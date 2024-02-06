import { Events, Listener } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import type { GuildScheduledEvent, PartialGuildScheduledEvent } from "discord.js";

@ApplyOptions<Listener.Options>({
    name: "guildScheduledEventUpdate",
    event: Events.GuildScheduledEventUpdate,
})
export class UserEvent extends Listener<typeof Events.GuildScheduledEventUpdate> {
    async run(
        oldScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent | null,
        newScheduledEvent: GuildScheduledEvent
    ) {

    }
}
