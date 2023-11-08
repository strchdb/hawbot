import { Client, Events, GatewayIntentBits } from 'discord.js';

try {
    require('dotenv').config()
} catch (error) {
    console.log(error);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c: any) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
