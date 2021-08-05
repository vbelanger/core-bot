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

dataSource.createDatabase().then(() => {});

const shouldReply = (msg, data) => !isOwnMessage(msg) && (wasMentioned(msg) || (isInCoreChannel(msg) && (isImagePost(msg) || textContainsTrigger(msg, data))));
const shouldReact = (msg, data) => !isOwnMessage(msg) && (wasMentioned(msg) || textContainsTrigger(msg, data));
const isNumber = (msg) => !isOwnMessage(msg) && textContainsNumber(msg);
const isOwnMessage = (msg) => msg.author.id === bot.user.id;
const wasMentioned = (msg) => msg.mentions.find((user) => user.id === bot.user.id);
const isInCoreChannel = (msg) => msg.channel.name === 'core-player-quotes';
const isImagePost = (msg) => msg.attachments.length > 0;
const textContainsTrigger = (msg, data) => data.triggers.length > 0 ? msg.content.toLowerCase().match(new RegExp(data.triggers.map((t) => escapeRegex(t.word)).join('|'))) : false;
const textContainsNumber = (msg) => /\d/.test(msg.content);
const getRandomMessage = (data) => data.quotes.length > 0 ? data.quotes[Math.floor(Math.random() * data.quotes.length)].message : null;
const escapeRegex = (text) => text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const luisId = '536588367916433428'; //'luis.kd#6324' 
const isLuis = (msg) => msg.author.id == luisId;

const getData = async () => {
  const quotes = await dataSource.getQuotes();
  const triggers = await dataSource.getTriggers();
  return { quotes, triggers };
};

bot.on('messageCreate', async (msg) => {
  try {
    const data = await getData();

    if (shouldReply(msg, data)) {
      const message = getRandomMessage(data);
      if (message)
        await msg.channel.createMessage(message);
    }
    if (isNumber(msg)) {
      const message = "C'est des chiffres de chest press ça?";
      await msg.channel.createMessage(message);
    }
    if (isLuis(msg)) {
      await bot.addMessageReaction(msg.channel.id, msg.id, 'AngrySteph:805818730134896671')
    }
    else if (shouldReact(msg, data)) {
      await bot.addMessageReaction(msg.channel.id, msg.id, '❤️')
    }
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
