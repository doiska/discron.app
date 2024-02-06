import {
    Client,
    Events,
    GatewayIntentBits,
} from 'discord.js';
import {parseScheduledEvent} from "./helpers/parse-scheduled-event.ts";
import { SapphireClient } from "@sapphire/framework";

const client = new SapphireClient({
    intents: [GatewayIntentBits.Guilds],
});

client.on("guildScheduledEventCreate", event => {
    console.log("guildScheduledEventCreate", event);
})

client.on('guildScheduledEventUpdate', event => {
    console.log("guildScheduledEventUpdate", event);
})

client.on("guildScheduledEventDelete", event => {
    console.log("guildScheduledEventDelete", event);
})

client.on("guildScheduledEventError", event => {
    console.log("guildScheduledEventError", event);
})


client.once(Events.ClientReady, async (c) => {
    const guild = await c.guilds.fetch(process.env.GUILD_ID!);

    const fetchedEvents = await guild.scheduledEvents.fetch({
        cache: false,
    })

    const events = fetchedEvents.map(parseScheduledEvent);

    console.log(events);
});

client.login(process.env.DISCORD_TOKEN);
