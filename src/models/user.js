const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
	email: { type: String },
	name: { type: String },
	phoneNumber: { type: String },
});

userSchema.plugin(uniqueValidator, {
	message: "{PATH} debe de ser unico",
});

module.exports = model("user", userSchema);
