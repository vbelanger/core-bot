# core-bot
The corest of discord bots

## Commands

### Quotes
- `!quotes`: To get a dump of all available quotes, in JSON format.
- `!quotes add <text>`: To add a new quote to the bot. You can enclose the input in double quotes if you prefer, but it is not necessary. This command will return the quote ID.
- `!quotes remove <id>`: To remove an existing quote from the bot.

### Triggers
- `!triggers`: To get a dump of all current trigger words, in JSON format.
- `!triggers add <text>`: To add a new triger word to the bot. You can enclose the input in double quotes if you prefer, but it is not necessary. This command will return the trigger ID.
- `!triggers remove <id>`: To remove an existing trigger from the bot.

## Development

### Prerequisites
- NodeJS
- Active Discord application with bot user capability, go [here](https://discord.com/developers/applications) to register one
- Either an Azure Cosmos DB account, or the Azure Cosmos DB emulator
- Any Discord server to invite to bot to, for testing purposes

### Database

The bot uses Cosmos DB to manage its trigger words and messages. It assumes that a database with id `corebot` exists and has two containers, `quotes` and `triggers`. You'll need to set up the database yourself by creating these two containers.

### Environment

To debug the bot locally, you must set these environment variables:
- `BOT_TOKEN` (you can grab it from the Discord developer portal, in the Bot section of your application)
- `COSMOS_ENDPOINT`
- `COSMOS_KEY`

Once configured, simply run:
```
$ npm i
$ npm start
```

You can invite the bot to your server with this link `https://discord.com/oauth2/authorize?scope=bot&client_id=<BOT_ID>`. The bot ID can be retrieved from the Discord developer portal, in the Application section (it's called `Application ID`).
