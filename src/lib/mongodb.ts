import mongoose from "mongoose";

export async function connect() {
	try {
		mongoose.connect(process.env.DB_CONN_STRING!, {
			dbName: process.env.DB_NAME!,
			sanitizeFilter: true,
		});
		const connection = mongoose.connection;

		connection.on("connected", () => {
			console.log("MongoDB connected successfully");
		});

		connection.on("error", (err) => {
			console.log("MongoDB connection error" + err);
			process.exit();
		});
	} catch (error) {
		console.log(error);
	}
}
