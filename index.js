const eris = require('eris');
const app = require('express')();
const dataSource = require('./data');
const commands = require('./commands');

const port = process.env.PORT || 3000;

app.use(function (_, res) {
  res.send();
});

app.listen(port, () => {});

const bot = new eris.CommandClient(process.env.BOT_TOKEN, {}, { prefix: '!' });
commands.register(bot, dataSource);

const shouldReply = (msg, data) => !isOwnMessage(msg) && (wasMentioned(msg) || (isInCoreChannel(msg) && (isImagePost(msg) || textContainsTrigger(msg, data))));
const shouldReact = (msg, data) => !isOwnMessage(msg) && (wasMentioned(msg) || textContainsTrigger(msg, data));
const isOwnMessage = (msg) => msg.author.id === bot.user.id;
const wasMentioned = (msg) => msg.mentions.find((user) => user.id === bot.user.id);
const isInCoreChannel = (msg) => msg.channel.name === 'core-player-quotes';
const isImagePost = (msg) => msg.attachments.length > 0;
const textContainsTrigger = (msg, data) => msg.content.toLowerCase().match(new RegExp(data.triggers.map((t) => escapeRegex(t.word)).join('|')));
const getRandomMessage = (data) => data.quotes[Math.floor(Math.random() * data.quotes.length)].message;
const escapeRegex = (text) => text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

const getData = async () => {
  const quotes = await dataSource.getQuotes();
  const triggers = await dataSource.getTriggers();
  return { quotes, triggers };
};

bot.on('messageCreate', async (msg) => {
  try {
    const data = await getData();

    if (shouldReply(msg, data)) await msg.channel.createMessage(getRandomMessage(data));
    if (shouldReact(msg, data)) await bot.addMessageReaction(msg.channel.id, msg.id, '❤️');
  } catch (e) {
    console.error(e);
  }
});

bot.on('messageReactionAdd', async (msg, emoji, reactor) => {
  try {
    const message = await msg.channel.getMessage(msg.id);
    if (!isOwnMessage(message) || emoji.name != 'AngrySteph') return;

    const username = reactor.nick || reactor.user.username;
    await msg.channel.createMessage(`Tu n'aimes pas mon message ${username}?`);
  } catch (e) {
    console.error(e);
  }
});

bot.connect();
