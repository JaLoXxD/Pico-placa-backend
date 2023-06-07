const router = require("express-promise-router")();
const CarController = require("../controllers/car");

const handler = new CarController();

router.post("/createCar", (req, res) => handler.create(req, res));
router.post("/checkCar", (req, res) => handler.checkCirculation(req, res));
router.get("/cars", (req, res) => handler.getAllCars(req, res));

module.exports = router;
