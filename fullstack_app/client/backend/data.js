// /backed/data.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//this will be our database structure
const DataSchema = new Schema(
	{
		id: Number,
		message: String,
	},
	{timestamps: true}
);

// export new Schema so we can modify it using node.js
module.exports = mongoose.model("Data", DataSchema);

