import mongoose from "mongoose";

const SensorReadingSchema = mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  temperature: {
    type: String,
    required: true,
  },
  humidity: {
    type: String,
    required: true,
  },
  RainValue: {
    type: String,
    required: true,
  },
});

const ReadingsModel =
  mongoose.models.SensorReadings ||
  mongoose.model("SensorReadings", SensorReadingSchema, "SensorReadings");

export default ReadingsModel;
