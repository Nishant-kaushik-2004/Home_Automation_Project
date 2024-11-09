/* eslint-disable @typescript-eslint/no-unused-vars */
import ReadingsModel from "@/models/readings.model";
import dbConnect from "../../../lib/dbConnection";
import { NextResponse } from "next/server";
import { Parser } from "@json2csv/plainjs";
import moment from "moment-timezone";
import { create } from "xmlbuilder2";

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const startDate = decodeURIComponent(searchParams.get("startDate"));
    const endDate = decodeURIComponent(searchParams.get("endDate"));
    const format = searchParams.get("format");
    console.log(startDate, endDate, format);

    const filters = {
      created_at: {
        $gte: moment
          .tz(startDate.replace("%20", " "), "Asia/Kolkata")
          .utc()
          .toDate(),
        $lte: moment
          .tz(endDate.replace("%20", " "), "Asia/Kolkata")
          .utc()
          .toDate(),
      },
    };
    console.log(
      moment.tz(startDate.replace("%20", " "), "Asia/Kolkata").toDate(),
      moment.tz(endDate.replace("%20", " "), "Asia/Kolkata").toDate()
    );
    const filteredReadings = await ReadingsModel.find(filters).lean();

    if (!filteredReadings.length) {
      return NextResponse.json(
        {
          message: "No Readings found in the selected dates",
        },
        { status: 404 }
      );
    }

    if (format === "csv") {
      // Clean the MongoDB documents by removing _id field
      // You can modify this based on what fields you want to include/exclude
      const cleanData = filteredReadings.map(({ _id, __v, ...rest }) => rest);
      const opts = {
        fields: Object.keys(cleanData[0]), // Gets fields from first document
        delimiter: ",",
        header: true,
      };

      // Convert to CSV
      const parser = new Parser(opts);
      const csv = parser.parse(filteredReadings);
      return new NextResponse(
        csv,
        {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=data.csv",
          },
        },
        { status: 200 }
      );
    } else if (format === "json") {
      return NextResponse.json(filteredReadings, { status: 200 });
    } else if (format === "xml") {
      console.log("inside xml formatter");
      // Create XML using xmlbuilder2
      const xml = create({ version: "1.0", encoding: "UTF-8" }).ele("root");
      
      filteredReadings.forEach((reading) => {
        xml
        .ele("item")
        .ele("created_at")
        .txt(reading.created_at.toISOString())
        .up()
        .ele("temperature")
        .txt(reading.temperature)
        .up()
        .ele("humidity")
        .txt(reading.humidity)
        .up()
        .up(); // Close 'item' element
      });

      const xmlString = xml.end({ prettyPrint: true });

      // Return XML response with download headers
      return new NextResponse(
        xmlString,
        {
          headers: {
            "Content-Type": "application/xml",
            "Content-Disposition": 'attachment; filename="data.xml"',
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Invalid format" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
