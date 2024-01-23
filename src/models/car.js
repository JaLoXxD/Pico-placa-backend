const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate-v2");

const carSchema = new Schema({
	plate: { type: String, unique: true },
	color: { type: String },
	carModel: { type: String },
	year: { type: Number },
	user: { type: Schema.Types.ObjectId, ref: 'user' } // Reference field to the user schema
});

carSchema.plugin(uniqueValidator, {
	message: "{PATH} debe de ser unico",
});

carSchema.plugin(mongoosePaginate);

module.exports = model("car", carSchema);
