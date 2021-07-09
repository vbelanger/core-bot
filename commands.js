const sanitize = (text) =>
  text
    .trim()
    .replace(/^"+|"+$/g, '')
    .trim();

const toCodeText = (text) => `\`\`\`${text}\`\`\``;

const reply = async (id, channel, type, op) => {
  const message = id ? toCodeText(`${op} ${type} with id ${id}.`) : toCodeText(`Sorry, ${type} could not be ${op.toLowerCase()}.`);
  await channel.createMessage(message);
};

const dumpTo = async (channel, items) => {
  const message = JSON.stringify(items, null, 2);
  await channel.createMessage({}, { file: Buffer.from(message), name: `data.json` });
};

module.exports = {
  register(bot, dataSource) {
    const quoteCommand = bot.registerCommand('quotes', async (msg, args) => {
      if (args.length > 0) return toCodeText('Invalid command. Usage: !quotes');

      const items = await dataSource.getQuotes();
      await dumpTo(msg.channel, items);
    });

    quoteCommand.registerSubcommand('add', async (msg, args) => {
      if (args.length === 0) return toCodeText('Invalid command. Usage: !quotes <add/remove> <text/id>');

      const text = sanitize(args.join(' '));
      const id = await dataSource.addQuote(text);
      await reply(id, msg.channel, 'quote', 'Added');
    });

    quoteCommand.registerSubcommand('remove', async (msg, args) => {
      if (args.length !== 1) return toCodeText('Invalid command. Usage: !quotes <add/remove> <text/id>');

      const command = sanitize(args[0]);
      const id = await dataSource.deleteQuote(command);
      await reply(id, msg.channel, 'quote', 'Removed');
    });

    const triggerCommand = bot.registerCommand('triggers', async (msg, args) => {
      if (args.length > 0) return toCodeText('Invalid command. Usage: !triggers');

      const items = await dataSource.getTriggers();
      await dumpTo(msg.channel, items);
    });

    triggerCommand.registerSubcommand('add', async (msg, args) => {
      if (args.length === 0) return toCodeText('Invalid command. Usage: !triggers <add/remove> <text/id>');

      const text = sanitize(args.join(' '));
      const id = await dataSource.addTrigger(text);
      await reply(id, msg.channel, 'trigger', 'Added');
    });

    triggerCommand.registerSubcommand('remove', async (msg, args) => {
      if (args.length !== 1) return toCodeText('Invalid command. Usage: !triggers <add/remove> <text/id>');

      const command = sanitize(args[0]);
      const id = await dataSource.deleteTrigger(command);
      await reply(id, msg.channel, 'trigger', 'Removed');
    });
  },
};
