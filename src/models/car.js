const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const carSchema = new Schema({
	placa: { type: String, unique: true },
	color: { type: String },
	modelo: { type: String },
	chasis: { type: String },
	anio: { type: Number },
});

userSchema.plugin(uniqueValidator, {
	message: "{PATH} debe de ser unico",
});

module.exports = model("car", carSchema);
