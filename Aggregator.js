class Aggregator {
	posts = [];

	constructor() {}

	add(tweet) {
		this.posts.push(tweet);
	}

	score(tweet) {
		const whitelistedUrls = [
			"www.indiehackers.com",
			"saas.transistor.fm",
			"www.justinjackson.ca",
			"www.marketingexamples.com",
			"www.paulgraham.com",
			"m.signalvnoise.com",
			"www.thebootstrappedfounder.com"
		];

		let urlScore = 0,
			favoriteScore = tweet.favorite_count * 1.2,
			retweetScore = tweet.retweet_count * 1.4;

		tweet.entities.urls.forEach((url) => {
			const regex = /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i,
				formattedUrl = url.expanded_url
					.toLowerCase()
					.match(regex, "")[1];

			if (whitelistedUrls.includes(formattedUrl)) urlScore += 10000;
		});

		tweet.score = favoriteScore + retweetScore + urlScore;

		return tweet;
	}

	sort() {
		this.posts.sort((a, b) => {
			return b.score - a.score;
		});
	}
}

module.exports = Aggregator;
