import mongoose, { Schema } from "mongoose";

const metaUserSchema = new Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: [true, "Please provide user id"],
	},
	docs: [String],
});

const MetaUser =
	mongoose.models.MetaUser || mongoose.model("MetaUser", metaUserSchema);

export default MetaUser;
