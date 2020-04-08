require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;

class MongoDBConnection {
	client = {};

	constructor() {
		const { MONGO_DB_URI_CONNECTION_STRING } = process.env;

		this.client = new MongoClient(MONGO_DB_URI_CONNECTION_STRING);
	}

	write() {
		// client.connect((err) => {
		// 	console.log("Connected successfully to server");
		// 	const db = client.db(dbName);
		// 	client.close();
		// });
	}

	checkForEntries(collection, source) {
		this.client.connect(() => {
			console.log("Connected to DB Server Successfully...");

			const db = this.client.db("makerdaily"),
				collection = db.collection(collection);

			collection.find(source);
		});
	}
}

module.exports = MongoDBConnection;
