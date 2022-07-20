const moment = require("moment");
class Car {
	constructor() {
		this.carSchema = require("../models/car");
	}
	validateCarPlate = (val) => {
		const rules = /^[A-Z]{3}-\d{3,4}?$/;
		return rules.test(val);
	};
	async create(req, res) {
		try {
			const { placa, color, modelo, chasis, anio } = req.body;

			if (placa === "" || color === "" || modelo === "" || chasis === "" || anio === "") {
				return res.status(400).json({
					success: false,
					message: "All the inputs are required. Please check and try again.",
				});
			}
			if (!this.validateCarPlate(placa)) {
				return res.status(400).json({
					success: false,
					message: "Please type a valid car plate.",
				});
			}
			const newCar = this.carSchema({
				placa: placa,
				color: color,
				modelo: modelo,
				chasis: chasis,
				anio: parseInt(anio),
			});
			const query = await newCar.save();
			return res.status(200).json({
				success: true,
				message: "Car saved successfully...",
				query,
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
	async checkCirculation(req, res) {
		try {
			const { placa, date } = req.query;
			const serverTime = moment();
			const inputTime = moment(new Date(date)).utc().utcOffset("+00:00");
			console.log(serverTime);
			console.log(inputTime);
			if (serverTime.diff(inputTime, "minutes") > 1) {
				return res.status(200).json({
					success: false,
					message: `The date cannot be less than current date`,
					info: {
						currentDate: serverTime,
						inputDate: inputTime,
					},
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
			const startPeriod1 = moment(date);
			startPeriod1.set("hour", 6);
			startPeriod1.set("minute", 0);
			startPeriod1.set("second", 0);
			const endPeriod1 = moment(date);
			endPeriod1.set("hour", 9);
			endPeriod1.set("minute", 30);
			endPeriod1.set("second", 0);
			const startPeriod2 = moment(date);
			startPeriod2.set("hour", 16);
			startPeriod2.set("minute", 0);
			startPeriod2.set("second", 0);
			const endPeriod2 = moment(date);
			endPeriod2.set("hour", 21);
			endPeriod2.set("minute", 0);
			endPeriod2.set("second", 0);
			if (
				allowedNumbers.includes(parseInt(lastNumber)) &&
				!moment(date).isBetween(startPeriod1, endPeriod1) &&
				!moment(date).isBetween(startPeriod2, endPeriod2)
			) {
				allowed = true;
			}
			const filter = {
				placa: placa,
			};
			const car = await this.carSchema.findOne(filter);
			if (!car) {
				return res.status(200).json({
					success: false,
					message: `There are not a car with this car plate: (${placa})`,
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
				info: {
					currentDate: serverTime,
					inputDate: inputTime,
				},
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
	async getAllCars(req, res) {
		try {
			const cars = await this.carSchema.find();
			return res.status(200).json({
				success: true,
				message: "All cars...",
				cars,
			});
		} catch (err) {
			return res.status(500).json({
				success: false,
				message: "There was an error...",
				err,
			});
		}
	}
}

module.exports = Car;
