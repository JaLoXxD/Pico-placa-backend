const router = require("express-promise-router")();

router.get("/", (req, resp) => {
	resp.status(200).json({
		message: "Hola mundo",
	});
});

module.exports = router;
