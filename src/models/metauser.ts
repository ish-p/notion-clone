import mongoose, { Schema } from "mongoose";

const metaUserSchema = new Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: [true, "Please provide user id"],
	},
	docs: [
		{
			_id: false,
			docId: String,
			name: String,
			role: {
				type: String,
				enum: ["owner", "editor"],
			},
		},
	],
});

const MetaUser =
	mongoose.models.MetaUser || mongoose.model("MetaUser", metaUserSchema);

export default MetaUser;
