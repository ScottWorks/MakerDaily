const request = require("request"),
	cheerio = require("cheerio"),
	Scraper = require("./Scraper");

class Rss extends Scraper {
	rawData = "";
	parsedData = [];

	constructor() {
		super();
	}

	fetch() {
		return new Promise((resolve, reject) => {
			try {
				request(url, (err, response, body) => {
					if (err) throw err;
					this.rawData = body;
					resolve();
				});
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
}

module.exports = Rss;
