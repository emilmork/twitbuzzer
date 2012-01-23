
exports.app = {
	// Regular expressions to recognize tweets
	SPOTIFY_REGEX: /http(?:s?):\/\/open\.spotify\.com\/([a-z]+)\/([a-zA-Z0-9]{22})/,
	GITHUB_REGEX: /http(?:s?):\/\/github\.com\/([a-zA-Z0-9\_\-]+)\/([a-zA-Z0-9\_\-]+)\/?/,

	// MongoDB Settings
	DB_URL: "",
	DB_NAME: "",
	DB_USER: "",
	DB_PASS: "",

	// Twitter Settings
	consumer_key: '',
	consumer_secret: '',
	access_token_key: '',
	access_token_secret: ''
}