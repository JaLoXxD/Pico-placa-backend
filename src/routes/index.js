const router = require("express-promise-router")();
const CarController = require("../controllers/car");

const handler = new CarController();

router.post("/createCar", (req, res) => handler.create(req, res));
router.post("/checkCar", (req, res) => handler.checkCirculation(req, res));
router.get("/allCars", (req, res) => handler.getAllCars(req, res));
router.get("/cars", (req, res) => handler.getCars(req, res));
router.post("/cars/filter", (req, res) => handler.filterCars(req, res));
router.get("/testData", (req, res) => handler.createDBTestData(req, res));

module.exports = router;
