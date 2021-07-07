const eris = require('eris');

const bot = new eris.Client(process.env.BOT_TOKEN);

const shouldReply = (msg) => !isOwnMessage(msg) && (isImageInCoreChannel(msg) || textContainsTrigger(msg));
const isOwnMessage = (msg) => msg.author.id === bot.user.id;
const isImageInCoreChannel = (msg) => msg.channel.name === 'core-player-quotes' && msg.attachments.length > 0;
const textContainsTrigger = (msg) => msg.content.match(/enfant|femme|core|steph|docker/);

const messages = [
  "Sorry gang! Je peux pas aujourd'hui, je m'occupe des enfants! Amusez-vous bien!!! :heart:",
  'Je ne peux pas ici, je dine avec ma femme',
  "Pas sûr que je vais me pointer demain si ça sent, je suis sensible à ce genre d'odeur la...ce serait pe + la semaine prochaine",
  "J'ai un petit pincement au coeur car j'ai pas mal été \"l'architecte de solution par la bande et par proxy\" pendant quelques années lol mais bonne chances pour tes futurs défis! :heart:",
  'Je les connais pas eux, mais je suis willing de les connaitre!',
  "Je trippe sur plein d'affaires moi aussi, on va bien s'entendre je crois!",
];

function getRandomMessage() {
  return messages[Math.floor(Math.random() * messages.length)];
}

bot.on('ready', () => {
  console.log('Connected and ready.');
});

bot.on('messageCreate', async (msg) => {
  if (shouldReply(msg)) {
    try {
      await msg.channel.createMessage(getRandomMessage());
    } catch (err) {
      console.warn(err);
    }
  }
});

bot.on('error', (err) => {
  console.warn(err);
});

bot.connect();
