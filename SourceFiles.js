const fs = require("fs");

class SourceFiles {
	constructor() {}

	getSourcePaths() {
		return new Promise((resolve, reject) => {
			try {
				fs.readdir("sources", (err, files) => {
					if (err) throw err;

					const appendedFiles = files.map(
						(file) => "./sources/" + file
					);

					resolve(appendedFiles);
				});
			} catch (err) {
				console.error(err);
				reject(err);
			}
		});
	}

	getConfig(path) {
		return new Promise((resolve, reject) => {
			try {
				fs.readFile(path, (err, config) => {
					if (err) throw err;
					resolve(JSON.parse(config));
				});
			} catch (err) {
				console.error(err);
				reject(err);
			}
		});
	}
}

module.exports = SourceFiles;
