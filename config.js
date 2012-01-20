
module.exports = {
	// Regular expressions to recognize tweets
	SPOTIFY_REGEX: /http(?:s?):\/\/open\.spotify\.com\/([a-z]+)\/([a-zA-Z0-9]{22})/,
	GITHUB_REGEX: /http(?:s?):\/\/github\.com\/([a-zA-Z0-9\_\-]+)\/([a-zA-Z0-9\_\-]+)\/?/,

	// MongoDB Settings
	// mongodb://heroku_app2530248:hkas3dm8ibo3te8op6cv81ima6@ds029797.mongolab.com:29797/heroku_app2530248
	DB_URL: "ds029797.mongolab.com:29797",
	DB_NAME: "heroku_app2530248",
	DB_USER: "heroku_app2530248",
	DB_PASS: "hkas3dm8ibo3te8op6cv81ima6",

	// Twitter Settings
	consumer_key: 'd45dmERqPcgbhXUXtXciQ',
	consumer_secret: 'YVw7xoMzVC6p7RNrTsTFcd2VPxQN0oTnilcHmH8cs',
	access_token_key: '40382389-AWpD5CVziGPIrrvTFmNp6YffLrEShUvzNQ1iRQuc8',
	access_token_secret: 'Zz39fgkdezr7ZX0xOPdIR7pf7zrpKkYz3S9CEk1E'
}