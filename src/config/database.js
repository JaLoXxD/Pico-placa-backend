class DB {
	constructor() {
		this.mongoose = require("mongoose");
	}

	connectDB() {
		const { DB_URL } = process.env;
		this.mongoose
			.connect(DB_URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then((db) => {
				console.log("Database connected...");
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

module.exports = DB;
