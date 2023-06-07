const moment = require('moment');
const UserController = require('./user');
class Car {
	constructor() {
		this.carSchema = require('../models/car');
		this.userController = new UserController();
	}
	validateCarPlate = (val) => {
		const rules = /^[A-Z]{3}-\d{3,4}?$/;
		return rules.test(val);
	};
	async create(req, res) {
		try {
			const { carInfo, userInfo } = req.body;
			const { plate, color, carModel, chasis, year } = carInfo;

			console.log('Enter to REST /createCar');

			if (plate === '' || color === '' || carModel === '' || chasis === '' || year === '') {
				return res.status(400).json({
					success: false,
					message: 'All the inputs are required. Please check and try again.',
				});
			}
			if (!this.validateCarPlate(plate)) {
				return res.status(400).json({
					success: false,
					message: 'Please type a valid car plate.',
				});
			}
			const newUser = await this.userController.create(userInfo);
			const newCar = this.carSchema({
				plate,
				color,
				carModel,
				chasis,
				year: parseInt(year),
				user: newUser._id,
			});
			const query = await newCar.save();
			delete query._doc._id;
			delete query._doc.__v;
			return res.status(200).json({
				success: true,
				message: 'Car saved successfully...',
				query,
			});
		} catch (err) {
			console.log(err);
			return res.status(500).json({
				success: false,
				message: 'There was an error...',
				err,
			});
		}
	}
	async checkCirculation(req, res) {
		try {
			const { plate, date } = req.body;
			const serverTime = moment();
			const inputTime = moment(new Date(date)).utc().utcOffset('+05:00');
			if (serverTime.diff(inputTime, 'minutes') > 300) {
				return res.status(200).json({
					success: false,
					message: `The date cannot be less than current date`,
					info: {
						currentDate: serverTime,
						inputDate: inputTime,
					},
				});
			}
			const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
			const lastNumber = plate.slice(-1);
			const day = moment(date).format('dddd');
			let allowedNumbers = [];
			if (day === 'Monday') {
				allowedNumbers = [1, 2];
			}
			if (day === 'Tuesday') {
				allowedNumbers = [3, 4];
			}
			if (day === 'Wednesday') {
				allowedNumbers = [5, 6];
			}
			if (day === 'Thursday') {
				allowedNumbers = [7, 8];
			}
			if (day === 'Friday') {
				allowedNumbers = [9, 0];
			}
			if (day === 'Saturday' || day === 'Sunday') {
				allowedNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
			}
            let status = 200;
			let allowed = false;
            let success = false;
            let message = 'circulation.car.success';
            let info = {
                currentDate: serverTime,
                inputDate: inputTime,
            };
			const startPeriod1 = moment(date);
			startPeriod1.set('hour', 6);
			startPeriod1.set('minute', 0);
			startPeriod1.set('second', 0);
			const endPeriod1 = moment(date);
			endPeriod1.set('hour', 9);
			endPeriod1.set('minute', 30);
			endPeriod1.set('second', 0);
			const startPeriod2 = moment(date);
			startPeriod2.set('hour', 16);
			startPeriod2.set('minute', 0);
			startPeriod2.set('second', 0);
			const endPeriod2 = moment(date);
			endPeriod2.set('hour', 20);
			endPeriod2.set('minute', 0);
			endPeriod2.set('second', 0);
			if (
				(allowedNumbers.includes(parseInt(lastNumber)) &&
					!moment(date).isBetween(startPeriod1, endPeriod1) &&
					!moment(date).isBetween(startPeriod2, endPeriod2)) ||
				!allowedNumbers.includes(parseInt(lastNumber))
			) {
				allowed = true;
			}
			const filter = {
				plate: plate,
			};
			const car = await this.carSchema.findOne(filter);
			if (!car) {
                status = 500;
                success = false;
                message = `There are not a car with this car plate: (${plate})`;
			}
            if (!allowed) {
                status = 500;
                success = false;
                message = `circulation.car.error`;
            }
			return res.status(status).json({
				success,
				message,
				car,
				lastNumber,
				day: days[day - 1],
				allowed,
				info,
			});
		} catch (err) {
			console.log(err);
			return res.status(500).json({
				success: false,
				message: 'There was an error...',
				err,
			});
		}
	}
	async getAllCars(req, res) {
		try {
			const cars = await this.carSchema.find().populate({path: "user", select: "name email phoneNumber"}).select('-__v');
			return res.status(200).json({
				success: true,
				message: 'All cars...',
				cars,
			});
		} catch (err) {
            console.log(err)
			return res.status(500).json({
				success: false,
				message: 'There was an error...',
				err,
			});
		}
	}
}

module.exports = Car;
