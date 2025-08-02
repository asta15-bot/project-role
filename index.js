const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once("ready", () => {
  console.log(`✅ جاهز بحساب: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!قيف_اواي")) {
    const args = message.content.split(" ").slice(1);
    const time = parseInt(args[0]) * 1000; // الوقت بالثواني
    const prize = args.slice(1).join(" ");

    if (!time || !prize) {
      return message.reply("❗ الصيغة: `!قيف_اواي [الوقت بالثواني] [الجائزة]`");
    }

    const giveawayMessage = await message.channel.send(`🎉 **سحب على ${prize}**\n⌛ ينتهي خلال ${args[0]} ثانية!\nاضغط 🎉 للمشاركة!`);

    await giveawayMessage.react("🎉");

    setTimeout(async () => {
      const msg = await message.channel.messages.fetch(giveawayMessage.id);
      const users = (await msg.reactions.cache.get("🎉").users.fetch()).filter(u => !u.bot).map(u => u);
      
      if (users.length === 0) {
        message.channel.send("❌ لم يشارك أحد في القيف أواي.");
      } else {
        const winner = users[Math.floor(Math.random() * users.length)];
        message.channel.send(`🎊 الفائز بـ **${prize}** هو: ${winner}`);
      }
    }, time);
  }
});

client.login(process.env.TOKEN);
