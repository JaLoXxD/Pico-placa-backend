class Server {
	constructor() {
		this.express = require("express");
		this.api = this.express();
		this.cors = require("cors");
		this.bodyParser = require("body-parser");
		this.router = require("../routes/index");
		require("dotenv").config();
	}
	setPort() {
		const { API_PORT } = process.env;
		this.api.set("port", process.env.PORT || API_PORT);
	}
	setMiddleware() {
		this.api.use(this.bodyParser.urlencoded({ extended: true }));
		this.api.use(this.bodyParser.json());
		this.api.use(this.cors());
	}
	connectMongoDB() {
		const DB = require("./database");
		const conn = new DB();
		conn.connectDB();
	}
	start() {
		this.setPort();
		this.setMiddleware();
		this.api.use(this.router);
		this.connectMongoDB();
		this.api.listen(this.api.get("port"), () => {
			console.log(`Server is listening at port ${this.api.get("port")}`);
		});
	}
}

module.exports = Server;
