const fs = require("fs"),
	Twitter = require("./Twitter");

class Maker {
	config = {};

	constructor(config) {
		this.config = config;
	}

	getFilteredTweets() {
		const twitter = new Twitter(),
			{ username } = this.config;

		return twitter.getUserTimeline(username).then((tweets) => {
			return tweets;
		});
	}
}

module.exports = Maker;
