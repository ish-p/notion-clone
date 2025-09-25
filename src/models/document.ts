import { generateRandomName } from "@/lib/utils";
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
	{
		ownerEmail: {
			type: String,
			required: [true, "Please provide owner email"],
		},
		name: {
			type: String,
			default: generateRandomName,
		},
		editors: {
			type: [String],
		},
		content: {
			type: Object,
		},
	},
	{ timestamps: true }
);

const Document =
	mongoose.models.Document || mongoose.model("Document", documentSchema);

export default Document;
