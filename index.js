const eris = require('eris');
const app = require('express')();

const port = process.env.PORT || 3000;
app.use(function (req, res) {
  res.send();
});

app.listen(port, () => {});

const bot = new eris.Client(process.env.BOT_TOKEN);

const shouldReply = (msg) => !isOwnMessage(msg) && (isImageInCoreChannel(msg) || textContainsTrigger(msg));
const isOwnMessage = (msg) => msg.author.id === bot.user.id;
const isImageInCoreChannel = (msg) => msg.channel.name === 'core-player-quotes' && msg.attachments.length > 0;
const textContainsTrigger = (msg) => msg.content.toLowerCase().match(/enfant|femme|core|steph|stéph|docker|sre|raymont|garderie|gsoft|knox|employé #1|nexus|dine/);

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
  'Avant que vous nous posiez la question nous allons tous bien. La tornade a passé à quelques kilomètres de chez nous.',
  "On peut t'aider avec ça!! Pu besoin de SQL Server local!",
  "Perf. Mais sache que dans SRE on a fait du Docker pour conteneuriser votre env de dev pu besoin d'Avoir le sqlpackage.exe etc",
  "Ok! Cest toi qui le sait! Anyway vous pouvez travailler avec le docker ou sans mais pour un dev vanille (genre Antoine Brisebois-Roy) ça l'accélère",
  "Je joue pas à des shooters, sorry. J'ai moins de réflexes qu'avant (quoique je suis quand même pas pire à FFXlV et ça demande du bon réflexe quand même dans les raid)",
  "Ici je compte venir à partir de Juillet, fort probablement 1 journée/semaine. J'ai hâte de vous revoir! :heart:",
  "Bienvenue les boys !! Je reach out tout de suite, je suis seul avec les enfants aujourd'hui, il y a des chances que je ne puisse pas participer à l'activité",
  'Je suis avec les enfants là',
  'À la garderie... pour la dernière fois en 2 semaines lol... A+!',
  'Mais ma femme travaille alors si les enfants ne dorment pas tout de suite ça se peut que je me connecte plus tard! Je vous tiendrai au courant ce soir',
  'Mardi, ma femme travaille à 12h. Mais je peux me pointer au bureau si absolument nécessaire (si il y a un fuck de garderie je vais devoir partir par contre)',
  "Ma femme a mal compris que je voulais travailler toute la journée ajd... j'ai dû dealer avec elle, je travaille jusqu'à midi, et je me reconnecte ce soir",
  "Hey, qu'est-ce qui arrive avec St-Hubert finalement? J'ai pe manqué un mémo!! Ce serait cool que l'équipe de dev fasse des poule requests!! Badum tsssss (joke copyright Ives Levi Diniz Rocha) :slight_smile:",
  "Merci pour les infos et le formulaire! :heart: Aussi merci d'utiliser le mot distanciation physique et non distanciation sociale :heart:",
  "J'ai un mac mais c'est + ma femme qui s'en sert... sorry moi non plus je peux pas t'aider",
  'Merci pour ces 4 ans de confiance (souviens-toi, au début tu ignorais le contexte totalement). Cela veut donc dire que dans les premiers embauchés, je serai le seul qui reste. Je garde le fort!',
  "J'ai finalement manqué tout ça... c'était la semaine de la gastro à la maison..j'ai manqué quoi? Qqn peut faire un recap?",
  "Bon weekend Nexus. Je t'aime :heart: Ici jardinage et piscine et....relaxer",
  'Moi non plus je ne veux pas contribuer tant à ce débat, mais je vais dire une chose: la violence engendre la violence. Peu importe si tu tire des roquettes de manière legit ou pas, ça reste de la violence. N.B. je ne prend pas position publiquement ni contre la Palestine ni contre Israël.',
  "Je suis d'accord. En discuter c'est le meilleur moyen de sensibiliser. On pourrait aussi s'afficher publiquement comme entreprise ouverte à ce sujet.",
  "J'aimerais juste dire que j'adore l'idée et je suis pour à 100%!!! :heart:",
  "Experience personnelle ici : moi et ma femme on a regardé la dernière saison de l'amour est dans le pré, et la plus belle histoire d'amour de la saison a été les 2 hommes qui sont tombé en amour et qui l'ont avoué a la télé. C'est le moment dans toute l'émission qui m'a ému le +. Pourquoi j'en parle? Parce que l'amour est universel et ne se limite pas à l'amour homme femme.",
  "Pour les voyages, je suis d'accord on n'est pas sortis du bois. Mettons que tu veux pas aller en Inde . Ma femme est moi on adore voyager, alors ça nous manque beaucoup.",
  'Hey est-ce que st-hubert a vu notre photo de groupe en train de manger le poulet?',
  'On a tu encore le droit de dire "ca va bien aller"? :slight_smile: Parce que j\'ai vraiment envie de le dire ces jours-ci',
  'Salut! Tu vas nous manquer. Bon succès pour la suite et on garde contact, et pe jouer à FF14 !!',
  'Qui va à Microsoft Build finalement? Moi je me suis registered!',
  "On n'aura pas eu la chance de collaborer sur beaucoup de trucs, tu es un collègue vraiment nice, très professionnel, et une bonne personne. Tu vas nous manquer!!! Bon succès dans tes futurs défis!!! Reviens nous voir quand tu  veux!!",
  "C'est des chiffres de chest press ça?",
  "Je me souviens que Nexus avait genre 3 jours d'existence et qu'on faisait un meeting dans le bureau de Ray-Mont, Charles, moi et eux... et Mathieu Roy qui n'était pas encore engagé officiellement lol. Des souvenirs.",
  '#Greg-Day! Mettez du Greg Noel dans les Sonos!!! Oh wait je suis pas au bureau lol',
  "Sérieux c'est votre choix de prendre le vaccin ou pas, et respectons nous tous dans ce choix. D'ailleurs je n'embarquerai pas dans un débat ici. Vous avez tous vos raisons de vouloir le prendre ou pas. Par contre, ceux qui aiment la salade de chou traditionnelle.....",
  "Pis la je vais ajouter 2 mots qui causent une discussion : PAS GAME!",
  "Je vais garder de bons souvenirs de nos débuts chez Nexus avec Charles, et de ton dévouement pour Nexus depuis le jour 1, tu as mis ton coeur Ia-dedans litéralement!! Vous allez en vendre en tabarnac des pillules :wink: Lâche pas les bitcoin lol",
  "Moi j'ai 220 heures sur Final Fantasy 14 depuis Novembre 2020 lol. Those MMOs hahaha",
  "Tu as oublié les meeting au Knox avec moi Greg PA et Charles au tout début!!!",
  "Hey!!!! :heart: :heart: :heart: Final Fantasssssyyyyyyyy!!!!!",
  "LOL!!!!!!",
  "Une biere avec charles. Pis tout le monde hahaha",
  "Merci tout le monde!! Beaucoup d'amour mis la-dedans j'aime ça! J'vous aimes!! :heart: (pis j'ai de l'alcool dans le sang lol)",
  "Fake news lol. STOP THE COUNT (bad pun) :smile:",
  "J'ADORE!!!",
  "Tjrs avec toi Charles et avec Nexus!! :heart:",
  "Salut gang!! Désolé pour mon retard j'étais pris dans le trafic de Mascouche (oui ça existe lol). :heart:",
  "Chaque année, je suis heureux et fier de célébrer Nexus et mon anniversaire de service en même temps. Démarrer une entreprise, c'est tout un défi et beaucoup de travail, et une opportunité extrêmement rare. Je suis toujours fier de faire partie de l'aventure malgré toutes les embûches et les ajustements qui se sont produits depuis le jour 1. Je suis toujours disponible pour m'impliquer et donner mon grain de sel / participer à ma manière aux réflexions qui font évoluer l'organisation. Je m'ennuie de vous et j'ai hâte de tous vous revoir (et voir pour la première fois tout un tas de gens qui ont été onboardés en remote). Bien hâte de popper le champagne avec vous tantôt!!! Cheers les boys/girls! Je vous aimes",
  "Heyyyyy!! Je suis en vacances mais je vous vois tantôt!!!! À tantôt ! :heart:"
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
