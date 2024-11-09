import { NextResponse } from "next/server";
import ReadingsModel from "@/models/readings.model"
import dbConnect from "../../../lib/dbConnection";

dbConnect();
export async function POST(request) {
  try {
    const reqBody = await request.json();
    const {field1,field2,field3,created_at} = reqBody ;
    const newReading = new ReadingsModel({
      created_at: created_at,
      temperature: field1,
      humidity: field2,
      RainValue: field3,
    });
    await newReading.save();
    return NextResponse.json(
      {
        success: true,
        message: "sensors reading successfully saved in database",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 404 }
    );
  }
}
