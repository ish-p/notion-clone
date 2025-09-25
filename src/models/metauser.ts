import mongoose, { Schema } from "mongoose";

const metaUserSchema = new Schema({
	email: {
		type: String,
		required: [true, "Please provide user email"],
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
