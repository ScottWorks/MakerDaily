const fs = require("fs"),
	request = require("request"),
	cheerio = require("cheerio");

class Maker {
	path = "";
	config = {};
	rawData = "";
	parsedData = [];

	constructor(path) {
		this.path = path;

		try {
			this.getConfigFile().then(() => {
				this.fetch().then(() => {
					this.parse();
					// console.log(this.parsedData);
				});
			});
		} catch (err) {
			console.error(err);
		}
	}

	getConfigFile() {
		return new Promise((resolve, reject) => {
			try {
				fs.readFile(this.path, (err, config) => {
					if (err) throw err;
					this.config = JSON.parse(config);
					resolve();
				});
			} catch (err) {
				console.error(err);
				reject(err);
			}
		});
	}

	fetch() {
		return new Promise((resolve, reject) => {
			try {
				const { method, url } = this.config;

				if (method === "rss") {
					request(url, (err, response, body) => {
						if (err) throw err;
						this.rawData = body;
						resolve();
					});
				}
			} catch (err) {
				console.error(err);
				reject(err);
			}
		});
	}

	parse() {
		try {
			const { method } = this.config;

			if (method === "rss") {
				const $ = cheerio.load(this.rawData, {
					xmlMode: true
				});

				const data = [];

				$("item").each((index, element) => {
					const set = {};

					set.title = $("title", element).text();
					set.link = $("link", element).text();
					set.date = $("pubDate", element).text();

					data.push(set);
				});

				this.parsedData = data;
			}
		} catch (err) {
			console.error(err);
		}
	}

	write() {
		// Checks if author exists in the DB
		// Checks for existing entries in the DB
		// If nothing exists, then push everything to the DB
		// Else check each item in DB against recent scrape, push new items
	}
}

module.exports = Maker;
