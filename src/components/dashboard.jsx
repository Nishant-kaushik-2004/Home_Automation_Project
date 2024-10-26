"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import TempImage from "@/public/temperature.png";
import HumidityImg from "@/public/humidity.png";
import Card from "@/components/card";

const Dashboard = () => {
  // States for temperature and humidity
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);

  // Fetch sensor data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch sensor data
  const fetchData = async () => {
    try {
      // Replace with actual API or WebSocket call
      const { data } = await axios.get(
        `https://api.thingspeak.com/channels/${process.env.NEXT_PUBLIC_CHANNEL_ID}/feeds.json?api_key=${process.env.NEXT_PUBLIC_API_KEY}&results=2`
      );
      console.log(data);
      const lastEntryIndex = data.feeds.length - 1;
      const lastEntry = data.feeds[lastEntryIndex];
      setTemperature(lastEntry.field1);
      setHumidity(lastEntry.field2);
      console.log("temperature : ", temperature);
      console.log("humidity : ", humidity);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-500 p-5">
      <div className=" rounded-lg  p-5 sm:p-12 max-w-xl w-full shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-16 mt-4">
          Real-Time Sensor Dashboard
        </h1>
        <div className="space-y-10">
          <Card img={TempImage} data={temperature} name={"Temperature"} />
          <Card img={HumidityImg} data={humidity} name={"Humidity"} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;