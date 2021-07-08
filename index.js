const eris = require('eris');
const app = require('express')();
const data = require('./data');

const port = process.env.PORT || 3000;
app.use(function (_, res) {
  res.send();
});

app.listen(port, () => {});

const bot = new eris.Client(process.env.BOT_TOKEN);

const shouldReply = (msg) => !isOwnMessage(msg) && (isImageInCoreChannel(msg) || textContainsTrigger(msg));
const isOwnMessage = (msg) => msg.author.id === bot.user.id;
const isImageInCoreChannel = (msg) => msg.channel.name === 'core-player-quotes' && msg.attachments.length > 0;
const textContainsTrigger = (msg) => msg.content.toLowerCase().match(data.trigger);
const getRandomMessage = () => data.messages[Math.floor(Math.random() * data.messages.length)];

bot.on('messageCreate', async (msg) => {
  if (shouldReply(msg))
    await msg.channel.createMessage(getRandomMessage());
});

bot.connect();
