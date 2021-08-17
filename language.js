const language = require('@google-cloud/language');

let client;
try {
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  client = new language.LanguageServiceClient({ credentials });
} catch {
  client = new language.LanguageServiceClient();
}

const getSentiment = async (text) => {
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  const [result] = await client.analyzeSentiment({ document });

  return result.documentSentiment;
};

module.exports = {
  getSentiment,
};
