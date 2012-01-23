
exports.app = {
	// Regular expressions to recognize tweets
	SPOTIFY_REGEX: /http(?:s?):\/\/open\.spotify\.com\/(track)\/([a-zA-Z0-9]{22})/,
	GITHUB_REGEX: /http(?:s?):\/\/github\.com\/([a-zA-Z0-9\_\-]+)\/([a-zA-Z0-9\_\-]+)\/?/,

	// MongoDB Settings
	// Stupid me... Had to commit prod sensitive data. 
	// User/Pass/Keys are now changed and using enviroment data instead.
	DB_URL: process.env.MONGO_DB_URL,
	DB_NAME: process.env.MONGO_DB_NAME,
	DB_USER: process.env.MONGO_DB_USER,
	DB_PASS: process.env.MONGO_DB_PASS,

	// Twitter Settings
	consumer_key: process.env.TWITTER_consumer_key,
	consumer_secret: process.env.TWITTER_consumer_secret,
	access_token_key: process.env.TWITTER_access_token_key,
	access_token_secret: process.env.TWITTER_access_token_secret
}
