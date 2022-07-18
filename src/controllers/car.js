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
			const { placa } = req.body;
			const filter = {
				placa: placa,
			};
			const car = await this.carSchema.findOne(filter);
            console.log(car)
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
			});
		} catch (err) {
            console.log(err)
			return res.status(500).json({
				success: false,
				message: "There was an error...",
				err,
			});
		}
	}
}

module.exports = Car;
