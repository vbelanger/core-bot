const eris = require('eris');
const app = require('express')();
const data = require('./data');

const port = process.env.PORT || 3000;
app.use(function (_, res) {
  res.send();
});

app.listen(port, () => {});

const bot = new eris.Client(process.env.BOT_TOKEN);

const shouldReply = (msg) => !isOwnMessage(msg) && (wasMentioned(msg) || (isInCoreChannel(msg) && (isImagePost(msg) || textContainsTrigger(msg))));
const shouldReact = (msg) => !isOwnMessage(msg) && (wasMentioned(msg) || textContainsTrigger(msg));
const isOwnMessage = (msg) => msg.author.id === bot.user.id;
const wasMentioned = (msg) => msg.mentions.find((user) => user.id === bot.user.id);
const isInCoreChannel = (msg) => msg.channel.name === 'core-player-quotes';
const isImagePost = (msg) => msg.attachments.length > 0;
const textContainsTrigger = (msg) => msg.content.toLowerCase().match(data.trigger);
const getRandomMessage = () => data.messages[Math.floor(Math.random() * data.messages.length)];

bot.on('messageCreate', async (msg) => {
  try {
    if (shouldReply(msg))
      await msg.channel.createMessage(getRandomMessage());
    if (shouldReact(msg))
      await bot.addMessageReaction(msg.channel.id, msg.id, ❤️);
  } catch (e) {
    console.error(e);
  }
});

bot.on('messageReactionAdd', async (msg, emoji, reactor) => {
  try {
    const message = await bot.getMessage(msg.channel.id, msg.id);
    if (!isOwnMessage(message) || emoji.name != 'AngrySteph')
      return;

    const username = reactor.nick || reactor.user.username;
    await msg.channel.createMessage(`Tu n'aimes pas mon message ${username}?`);
  } catch (e) {
    console.error(e);
  }
});

bot.connect();
