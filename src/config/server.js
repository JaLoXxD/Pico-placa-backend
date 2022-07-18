class Server {
	constructor() {
		this.express = require("express");
		this.api = this.express();
		this.cors = require("cors");
		this.bodyParser = require("body-parser");
		require("dotenv").config();
	}
	setPort() {
		const { API_PORT } = process.env;
		this.api.set("port", process.env.PORT || API_PORT);
	}
	connectMongoDB() {
		const DB = require("./database");
		const conn = new DB();
		conn.connectDB();
	}
	start() {
		this.setPort();
		this.connectMongoDB();
		this.api.listen(this.api.get("port"), () => {
			console.log(`Server is listening at port ${this.api.get("port")}`);
		});
	}
}

module.exports = Server;
