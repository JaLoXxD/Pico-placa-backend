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
			res.status(200).json({
				success: true,
				message: "Car added successfully...",
				query,
			});
		} catch (err) {
			res.status(500).json({
				success: false,
				message: "There was an error...",
				err,
			});
		}
	}
}

module.exports = Car;
