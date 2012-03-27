# Twitbuzzer - Live stats for tweeted repositories

A page for tracking live stats for all repositories from github tweeted on Twitter. 
Uses socket.io and Twitters stream to live update repo stats.

## Features

1. Live updated (real time)
2. Searching for repositories and users
3. Stats in graph form


## Planned features
1. ~~Real time graph changes~~
2. URL for searches. 
3. More vast stats?
4. Tweet button
5. Language as categories?
6. Growl esc notification 


## Configuration
This is an heroku app, and uses environment variables to store info for Twitter OAuth and MongoDB user/pass. 
To add this to your heroku app, use these variables:

```
MONGO_DB_NAME               => "YOUR_DB_NAME"
MONGO_DB_PASS               => "YOUR_DB_PASS"
MONGO_DB_URL                => "YOUR_DB_URL"
MONGO_DB_USER               => "YOUR_DB_USERNAME"
TWITTER_access_token_key    => "YOUR_ACCESS_TOKEN_KEY"
TWITTER_access_token_secret => "YOUR_ACCESS_TOKEN_SECRET"
TWITTER_consumer_key        => "YOUR_CONSUMER_KEY"
TWITTER_consumer_secret     => "YOUR_CONSUMER_SECRET"
```

To add vars to heroku:

```
cd my_heroku_app/
heroku config:add MONGO_DB_NAME="YOUR_DB_NAME" MONGO_DB_PASS="YOUR_DB_PASS" MONGO_DB_URL="YOUR_DB_URL" MONGO_DB_USER="YOUR_DB_USERNAME" TWITTER_access_token_key="YOUR_ACCESS_TOKEN_KEY" TWITTER_access_token_secret="YOUR_ACCESS_TOKEN_SECRET" TWITTER_consumer_key="YOUR_CONSUMER_KEY" TWITTER_consumer_secret="YOUR_CONSUMER_SECRET"
```



