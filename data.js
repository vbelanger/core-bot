const CosmosClient = require('@azure/cosmos').CosmosClient;
const NodeCache = require('node-cache');

const config = {
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
  databaseId: 'corebot',
};

const { endpoint, key, databaseId } = config;

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);

const cache = new NodeCache();

const cacheTtl = 2 * 60 * 60;

const QUOTES_KEY = 'quotes';
const TRIGGERS_KEY = 'triggers';

const createDatabase = async () => {
  await createContainer('quotes');
  await createContainer('triggers');
};

const createContainer = async (containerId) => {
  const res = await client.databases.createIfNotExists({ id: databaseId }, { offerThroughput: 1000 });
  await res.database.containers.createIfNotExists({ id: containerId, partitionKey: { kind: 'Hash', paths: ['/id'] } });
};

const getQuotes = async () => {
  return await get(QUOTES_KEY, 'SELECT c.id, c.message from c');
};

const getTriggers = async () => {
  return await get(TRIGGERS_KEY, 'SELECT c.id, c.word from c');
};

const get = async (key, query) => {
  let data = cache.get(key);
  try {
    if (data == undefined) {
      const q = { query };

      const { resources: items } = await database.container(key).items.query(q).fetchAll();
      cache.set(key, items, cacheTtl);
      data = items;
    }
  } catch (e) {
    console.error(e);
  }
  return data || [];
};

const addQuote = async (quote) => {
  const existing = await getQuotes();
  const item = {
    id: getNewId(existing),
    message: quote,
  };

  return await addAndCache(QUOTES_KEY, item, existing);
};

const addTrigger = async (trigger) => {
  const existing = await getTriggers();
  const item = {
    id: getNewId(existing),
    word: trigger,
  };

  return await addAndCache(TRIGGERS_KEY, item, existing);
};

const addAndCache = async (key, item, existing) => {
  try {
    await database.container(key).items.create(item);
    cache.set(key, existing.concat(item), cacheTtl);
    return item.id;
  } catch (e) {
    console.error(e);
  }
};

const getNewId = (items) => items.length > 0 ? (Math.max(...items.map((x) => Number.parseInt(x.id))) + 1).toString() : "0";

const deleteQuote = async (id) => {
  const existing = await getQuotes();
  return await deleteItem(QUOTES_KEY, id, existing);
};

const deleteTrigger = async (id) => {
  const existing = await getTriggers();
  return await deleteItem(TRIGGERS_KEY, id, existing);
};

const deleteItem = async (key, id, existing) => {
  try {
    await database.container(key).item(id.toString(), id.toString()).delete();
    cache.set(
      key,
      existing.filter((x) => x.id !== id),
      cacheTtl
    );
    return id;
  } catch (e) {
    console.error(e);
    return null;
  }
};

module.exports = {
  createDatabase,
  getQuotes,
  getTriggers,
  addQuote,
  addTrigger,
  deleteQuote,
  deleteTrigger,
};
