require("dotenv").config();

const express = require("express"),
	cron = require("node-cron"),
	Aggregator = require("./Aggregator"),
	SourceFiles = require("./SourceFiles"),
	Maker = require("./Maker"),
	app = express(),
	{ PORT } = process.env;

(function getConfigFile() {
	const aggregator = new Aggregator(),
		sourceFiles = new SourceFiles();

	try {
		sourceFiles.getSourcePaths().then((paths) => {
			paths.forEach((path) => {
				sourceFiles.getConfig(path).then((config) => {
					const maker = new Maker(config);

					maker.getFilteredTweets().then((tweets) => {
						tweets.forEach((tweet) => {
							// score tweet
							scoredTweet = aggregator.score(tweet);

							// add to aggregator
							aggregator.add(scoredTweet);

							// sort aggregator
							aggregator.sort();

							console.log(aggregator.posts);
						});
					});
				});
			});
		});
	} catch (err) {
		console.error(err);
	}
})();

app.listen(PORT, () => console.log(`Trappin on port: ${PORT}`));
