const router = require("express-promise-router")();
const CarController = require("../controllers/car");

const handler = new CarController();

router.post("/createCar", (req, res) => handler.create(req, res));
router.get("/checkCar", (req, res) => handler.checkCirculation(req, res));

module.exports = router;
