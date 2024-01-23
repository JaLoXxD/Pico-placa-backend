const moment = require('moment');
const UserController = require('./user');
const UtilsController = require('./utils');
class Car {
	constructor() {
		this.carSchema = require('../models/car');
		this.userController = new UserController();
    this.utilsController = new UtilsController(); 
	}

  createRandomData(){
    const users = [];
    const cars = [];
    for(let i = 0; i < 50; i++){
      users.push({
        name: `John Doe ${i}`,
        email: `test${i}@gmail.com`,
        phoneNumber: '1234567890',
      }); 
    }
    for(let i = 0; i < 50; i++){
      cars.push({
        plate: this.utilsController.generateRandomPlate(),
        color: this.utilsController.generateRandomHexColor(),
        carModel: this.utilsController.getRandomCarBrand(),
        year: this.utilsController.generateRandomYear(),
      });
    }
    return{users, cars};
  }

	validateCarPlate = (val) => {
		const rules = /^[A-Z]{3}-\d{3,4}?$/;
		return rules.test(val);
	};

	toCamelCase(str) {
		const words = str.split(/[\s_-]+/); // Divide el string en palabras utilizando espacios, guiones y guiones bajos como separadores
		const camelCaseWords = words.map((word, index) => {
			if (index === 0) {
				return word.toLowerCase(); // La primera palabra se convierte a minúscula
			} else {
				return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Las palabras siguientes comienzan con mayúscula
			}
		});
		return camelCaseWords.join(''); // Une las palabras en un solo string sin espacios
	}

  async createDBTestData(req, res){
    const { users, cars } = this.createRandomData();
    users.forEach(async (user, i) => {
      const newUser = await this.userController.create(user);
      const newCar = this.carSchema({
        ...cars[i],
        user: newUser._id,
      });
      await newCar.save();
    });
    return res.status(200).json({
      success: true,
      message: 'Test data saved successfully...',
    });
  }

	async create(req, res) {
		let userId;
		try {
			const { carInfo, userInfo } = req.body;
			const { plate, color, carModel, year } = carInfo;

			console.log('Enter to REST /createCar');

			if (plate === '' || color === '' || carModel === '' || year === '') {
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
			userId = newUser._id;
			const newCar = this.carSchema({
				plate,
				color,
				carModel,
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
			if (userId) {
				console.log('enter');
				this.userController.deleteById(userId);
			}
			return res.status(500).json(this._buildGenericError(err));
		}
	}

	getErrorMessage(err) {
		if (err === 11000) {
			return 'errors.duplicatedEmail';
		}
		return `errors.${this.toCamelCase(err._message)}`;
	}

	async checkCirculation(req, res) {
		try {
			const { plate, date } = req.body;
			const serverTime = moment();
			// const inputTime = moment(new Date(date)).utc().utcOffset('+05:00');
			const inputTime = moment(new Date(date)).utc();
      const startPeriod1 = moment(date);
      let status = 200;
			let allowed = false;
			let success = false;
			let message = 'circulation.car.success';
			let info = {
				currentDate: serverTime,
				inputDate: inputTime,
			};
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
      console.log(lastNumber)
			let day = moment(date).format('dddd');
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
        allowed = true;
			}
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
				((day != "Saturday" || day != "Sunday") && allowedNumbers.includes(parseInt(lastNumber)) &&
					!moment(date).isBetween(startPeriod1, endPeriod1) &&
					!moment(date).isBetween(startPeriod2, endPeriod2))
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
			return res.status(500).json(this._buildGenericError(err));
		}
	}

	async getAllCars(req, res) {
		try {
			const cars = await this.carSchema.find().populate({ path: 'user', select: 'name email phoneNumber' }).select('-__v');
			return res.status(200).json({
				success: true,
				message: 'All cars...',
				cars,
			});
		} catch (err) {
			console.log(err);
			return res.status(500).json(this._buildGenericError(err));
		}
	}

	async getCars(req, res) {
		try {
      const { page, limit } = req.query;
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
      };
      const carsPaginated = await this.carSchema.paginate({}, options);
      return res.status(200).json({
        success: true,
        message: `Cars in page ${options.page} with limit ${options.limit}`,
        cars: carsPaginated.docs,
        limit: carsPaginated.limit,
        page: carsPaginated.page,
        nextPage: carsPaginated.nextPage,
        prevPage: carsPaginated.prevPage,
        totalDocs: carsPaginated.totalDocs,
        totalPages: carsPaginated.totalPages,
      });
		} catch (err) {
			console.log(err);
			return res.status(500).json(this._buildGenericError(err));
		}
	}

  async filterCars(req, res){
    try{
      const { page, limit } = req.query;
      const { searchTxt } = req.body;
      
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
      };
      const filter = {
        $or: [
          { plate: { $regex: searchTxt, $options: 'i' } },
          { carModel: { $regex: searchTxt, $options: 'i' } },
        ],
      };
      const carsPaginated = await this.carSchema.paginate(filter, options);
      return res.status(200).json({
        success: true,
        message: `Cars in page ${options.page} with limit ${options.limit}`,
        cars: carsPaginated.docs,
        limit: carsPaginated.limit,
        page: carsPaginated.page,
        nextPage: carsPaginated.nextPage,
        prevPage: carsPaginated.prevPage,
        totalDocs: carsPaginated.totalDocs,
        totalPages: carsPaginated.totalPages,
      });
    }catch(err){
      console.log(err);
      return res.status(500).json(this._buildGenericError(err));
    }
  }

	_buildGenericError(err) {
		return {
			success: false,
			message: 'There was an error...',
			err,
		};
	}
}

module.exports = Car;
