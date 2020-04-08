require("dotenv").config();

const request = require("request"),
	Scraper = require("./Scraper"),
	{
		TWITTER_API_KEY,
		TWITTER_API_SECRET_KEY,
		TWITTER_ACCESS_TOKEN,
		TWITTER_ACCESS_TOKEN_SECRET
	} = process.env;

class Twitter extends Scraper {
	static filterTweets(body, username) {
		return body
			.filter((tweet) => {
				const { created_at, favorite_count } = tweet,
					time = Date.parse(created_at),
					timeDelta = Date.now() - time;

				if (timeDelta < 86400000 && favorite_count > 5) return true;
				else return false;
			})
			.map((tweet) => {
				const {
						created_at,
						id,
						full_text,
						truncated,
						entities,
						favorite_count,
						retweet_count
					} = tweet,
					time = Date.parse(created_at);

				return {
					creator: username,
					created_date: created_at,
					creation_timestamp: time,
					id: id,
					text: full_text,
					truncated: truncated,
					retweet_count: retweet_count,
					favorite_count: favorite_count,
					entities: entities
				};
			});
	}

	oauth = {
		token: TWITTER_ACCESS_TOKEN,
		token_secret: TWITTER_ACCESS_TOKEN_SECRET,
		consumer_key: TWITTER_API_KEY,
		consumer_secret: TWITTER_API_SECRET_KEY
	};

	constructor() {
		super();
	}

	getUserTimeline(username) {
		return new Promise((resolve, reject) => {
			try {
				const parameters = {
					url:
						"https://api.twitter.com/1.1/statuses/user_timeline.json",
					method: "GET"
				};

				request(
					{
						uri: parameters.url,
						method: parameters.method,
						json: true,
						oauth: this.oauth,
						qs: {
							tweet_mode: "extended",
							screen_name: username,
							exclude_replies: true,
							include_rts: false
						}
					},
					(error, response, body) => {
						resolve(Twitter.filterTweets(body, username));
					}
				);
			} catch (err) {
				console.error(err);
				reject(err);
			}
		});
	}
}

module.exports = Twitter;
