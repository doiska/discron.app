import "./listeners/_load.ts";

import {
    GatewayIntentBits,
} from 'discord.js';

import { SapphireClient } from "@sapphire/framework";

const client = new SapphireClient({
    intents: [GatewayIntentBits.Guilds],
});


client.login(process.env.DISCORD_TOKEN);
