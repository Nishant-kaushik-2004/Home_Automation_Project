import mongoose from "mongoose";

const connection = { isConnected: 0 };
export default async function dbConnect() {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "",{});

    connection.isConnected = db.connections[0].readyState;
    console.log(db.connections);

    console.log("DB connected successfully");
  } catch (error) {
    console.log("database connection failed", error);
    process.exit(1);
  }
}
