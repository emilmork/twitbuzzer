
exports.app = {
  // Regular expressions to recognize tweets
  GITHUB_REGEX: /http(?:s?):\/\/github\.com\/([a-zA-Z0-9\_\-]+)\/([a-zA-Z0-9\_\-]+)\/?/,


  DB_URI: process.env.MONGOLAB_URI,
  DB_URL: process.env.MONGO_DB_URL,
  DB_NAME: process.env.MONGO_DB_NAME,
  DB_USER: process.env.MONGO_DB_USER,
  DB_PASS: process.env.MONGO_DB_PASS,

  // Twitter Settings
  consumer_key: process.env.TWITTER_consumer_key,
  consumer_secret: process.env.TWITTER_consumer_secret,
  access_token_key: process.env.TWITTER_access_token_key,
  access_token_secret: process.env.TWITTER_access_token_secret
};
