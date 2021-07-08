const eris = require('eris');
const app = require('express')();

const port = process.env.PORT || 3000;
app.use(function(req, res){
  res.send();
});

app.listen(port, () => {})

const bot = new eris.Client(process.env.BOT_TOKEN);

const shouldReply = (msg) => !isOwnMessage(msg) && (isImageInCoreChannel(msg) || textContainsTrigger(msg));
const isOwnMessage = (msg) => msg.author.id === bot.user.id;
const isImageInCoreChannel = (msg) => msg.channel.name === 'core-player-quotes' && msg.attachments.length > 0;
const textContainsTrigger = (msg) => msg.content.match(/enfant|femme|core|steph|docker|sre|raymont|nexus/);

const messages = [
  "Sorry gang! Je peux pas aujourd'hui, je m'occupe des enfants! Amusez-vous bien!!! :heart:",
  'Je ne peux pas ici, je dine avec ma femme',
  "Pas sûr que je vais me pointer demain si ça sent, je suis sensible à ce genre d'odeur la...ce serait pe + la semaine prochaine",
  "J'ai un petit pincement au coeur car j'ai pas mal été \"l'architecte de solution par la bande et par proxy\" pendant quelques années lol mais bonne chances pour tes futurs défis! :heart:",
  'Je les connais pas eux, mais je suis willing de les connaitre!',
  "Je trippe sur plein d'affaires moi aussi, on va bien s'entendre je crois!",
  "Désolé, je ne peux pas y être : je dois préparer et aller chercher mes enfants aujourd'hui, et c'est à 16h que ça se passe. Bienvenue chez toi, tu vas aimer l'activité :heart:",
  "Moi j'ai pas de setup de même, j'ai juste des poids libres jusqu'à 50 lbs",
  "Joyeux Nexusversaire!! Toé j'ai hâte de te voir en vrai! :slight_smile: (pis les autres aussi la!! Soyez pas jaloux :slight_smile: )",
  "Pour ceux qui suivent l'actualité, un de mes amis est passé a la télé hier, la tornade a fait des dégats sur son terrain (et lui il est saie). P.S. Nous on va bien. tout est ok (la tornade a passé proche de chez moi mais aucun dégat)",
  "Avant que vous nous posiez la question nous allons tous bien. La tornade a passé à quelques kilomètres de chez nous.",
  "On peut t'aider avec ça!! Pu besoin de SQL Server local!",
  "Perf. Mais sache que dans SRE on a fait du Docker pour conteneuriser votre env de dev pu besoin d'Avoir le sqlpackage.exe etc",
  "Ok! Cest toi qui le sait! Anyway vous pouvez travailler avec le docker ou sans mais pour un dev vanille (genre Antoine Brisebois-Roy) ça l'accélère",
  "Je joue pas à des shooters, sorry. J'ai moins de réflexes qu'avant (quoique je suis quand même pas pire à FFXlV et ça demande du bon réflexe quand même dans les raid)",
  "Ici je compte venir à partir de Juillet, fort probablement 1 journée/semaine. J'ai hâte de vous revoir! :heart:",
  "Bienvenue les boys !! Je reach out tout de suite, je suis seul avec les enfants aujourd'hui, il y a des chances que je ne puisse pas participer à l'activité",
  "Je suis avec les enfants là",
  "À la garderie... pour la dernière fois en 2 semaines lol... A+!",
  "Mais ma femme travaille alors si les enfants ne dorment pas tout de suite ça se peut que je me connecte plus tard! Je vous tiendrai au courant ce soir",
  "Mardi, ma femme travaille à 12h. Mais je peux me pointer au bureau si absolument nécessaire (si il y a un fuck de garderie je vais devoir partir par contre)",
  "Ma femme a mal compris que je voulais travailler toute la journée ajd... j'ai dû dealer avec elle, je travaille jusqu'à midi, et je me reconnecte ce soir",
  "Hey Sam, qu'est-ce qui arrive avec St-Hubert finalement? J'ai pe manqué un mémo!! Ce serait cool que l'équipe de dev fasse des poule requests!! Badum tsssss (joke copyright Ives Levi Diniz Rocha) :slight_smile:",
  "Merci pour les infos et le formulaire! :heart: Aussi merci d'utiliser le mot distanciation physique et non distanciation sociale :heart:",
  "J'ai un mac mais c'est + ma femme qui s'en sert... sorry moi non plus je peux pas t'aider",
  "Merci pour ces 4 ans de confiance (souviens-toi, au début tu ignorais le contexte totalement). Cela veut donc dire que dans les premiers embauchés, je serai le seul qui reste. Je garde le fort!",
  "J'ai finalement manqué tout ça... c'était la semaine de la gastro à la maison..j'ai manqué quoi? Qqn peut faire un recap?",
  "Bon weekend Nexus. Je t'aime :heart: Ici jardinage et piscine et....relaxer"
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
