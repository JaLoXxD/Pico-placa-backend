const moment = require("moment");
class Car {
	constructor() {
		this.carSchema = require("../models/car");
	}
	async create(req, res) {
		try {
			const { placa, color, modelo, chasis, anio } = req.body;
			const newCar = this.carSchema({
				placa: placa,
				color: color,
				modelo: modelo,
				chasis: chasis,
				anio: anio,
			});
			const query = await newCar.save();
			return res.status(200).json({
				success: true,
				message: "Car added successfully...",
				query,
			});
		} catch (err) {
			return res.status(500).json({
				success: false,
				message: "There was an error...",
				err,
			});
		}
	}
	async checkCirculation(req, res) {
		try {
			const { placa, date } = req.query;
			if (moment().diff(moment(date), "minutes") > 1) {
				return res.status(200).json({
					success: false,
					message: `The date cannot be less than current date`,
				});
			}
			const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
			const lastNumber = placa.slice(-1);
			const day = moment(date).format("dddd");
			let allowedNumbers = [];
			if (day === "Monday") {
				allowedNumbers = [1, 2];
			}
			if (day === "Tuesday") {
				allowedNumbers = [3, 4];
			}
			if (day === "Wednesday") {
				allowedNumbers = [5, 6];
			}
			if (day === "Thursday") {
				allowedNumbers = [7, 8];
			}
			if (day === "Friday") {
				allowedNumbers = [9, 0];
			}
			if (day === "Saturday" || day === "Sunday") {
				allowedNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
			}
			let allowed = false;
			if (allowedNumbers.includes(parseInt(lastNumber))) {
				allowed = true;
			}
			const filter = {
				placa: placa,
			};
			const car = await this.carSchema.findOne(filter);
			if (!car) {
				return res.status(200).json({
					success: false,
					message: `There are not a car with this id (${placa})`,
					car,
				});
			}
			return res.status(200).json({
				success: true,
				message: "Car",
				car,
				lastNumber,
				day: days[day - 1],
				allowed,
			});
		} catch (err) {
			console.log(err);
			return res.status(500).json({
				success: false,
				message: "There was an error...",
				err,
			});
		}
	}
}

module.exports = Car;
