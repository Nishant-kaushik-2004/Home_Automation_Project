/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TempImage from "@/public/temperature.png";
import HumidityImg from "@/public/humidity.png";
import rainImg from "@/public/rainIcon.png";
import Card from "@/components/card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiMiniInformationCircle } from "react-icons/hi2";
import ThingSpeakDataDownloader from "@/components/downloadButton";
import Chart from "@/components/chart";

const Dashboard = () => {
  const [temperature, setTemperature] = useState(28.2);
  const [humidity, setHumidity] = useState(59.6);
  const [RainValue, setRainValue] = useState(1024);
  const [status, setStatus] = useState(null);
  const [lastActive, setLastActive] = useState(null);
  const prevStatusRef = useRef(null);
  const temperatureStatusRef = useRef(25);
  const humidityStatusRef = useRef(60);
  const rainStatusRef = useRef(1000);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const temp = localStorage.getItem("temperature");
      const hum = localStorage.getItem("humidity");
      const rain = localStorage.getItem("RainValue");
      if (temp) setTemperature(temp);
      if (hum) setHumidity(hum);
      if (rain) setRainValue(rain);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 20000);

    return () => clearInterval(intervalId); // Clear the interval on cleanup
  }, []);

  useEffect(() => {
    // Only notify if status has changed
    if (prevStatusRef.current !== status) {
      prevStatusRef.current = status; // Stores the previous error state
      let message = "";
      if (status === 200) {
        message = "Sensor readings fetched successfully 🎉";
        notifySuccess(message);
      } else if (status === 404) {
        message = "Not found any sensor readings !";
        notifyError(message);
      } else {
        message = "Error fetching sensor readings !";
        notifyError(message);
      }
    }
  }, [status]);

  const notifyError = (msg) => {
    toast.error(msg, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const notifySuccess = (msg) => {
    toast.success(msg, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  useEffect(() => {
    if (temperatureStatusRef.current === temperature) return;
    if (temperatureStatusRef.current < 30 && Number(temperature) >= 30) {
      temperatureStatusRef.current = temperature;
      alert("It's a sunny day 🌤️! temperature started rising 🥵");
    } else if (temperatureStatusRef.current >= 30 && Number(temperature) < 30) {
      temperatureStatusRef.current = temperature;
      alert("temperaure goes down! 🌡️🥳");
    }
  }, [temperature]);

  useEffect(() => {
    if (humidityStatusRef.current === humidity) return;
    if (humidityStatusRef.current < 65 && Number(humidity) >= 65) {
      humidityStatusRef.current = humidity;
      alert("It's humid outside 😰 ! humidity keeps rising 🤕");
    } else if (humidityStatusRef.current >= 65 && Number(humidity) < 65) {
      humidityStatusRef.current = humidity;
      alert("It's less humid right now! 😎");
    }
  }, [humidity]);

  useEffect(() => {
    if (rainStatusRef.current === RainValue) return;
    if (rainStatusRef.current > 600 && Number(RainValue) <= 600) {
      rainStatusRef.current = RainValue;
      alert("It's raining  outside 🌧️ ! keep your umbrella near 🌂");
    } else if (rainStatusRef.current <= 600 && Number(RainValue) > 600) {
      rainStatusRef.current = RainValue;
      alert("Rain has almost stopped! ☂️🥳");
    }
  }, [RainValue]);

  // Format the date for Kolkata time (IST) using Intl.DateTimeFormat
  let options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  // save data to mongoDB
  const saveInDatabase = async (updation, data) => {
    // Assume `created_at` is in UTC
    let date = new Date(data.created_at);
    // Calculate Kolkata time by adding the offset (5 hours 30 minutes)
    let kolkataOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds
    let kolkataDate = new Date(date.getTime() + kolkataOffset);

    let newTemperature = Number(data.field1).toPrecision(4);
    let newHumidity = Number(data.field2).toPrecision(4);
    let newRainValue = Number(data.field3).toPrecision(4);

    try {
      const response = await axios.post("api/storeInCloud", {
        field1: updation === "updateTemperature" ? newTemperature : temperature,
        field2: updation === "updateHumidity" ? newHumidity : humidity,
        field3: updation === "updateRainValue" ? newRainValue : RainValue,
        created_at: kolkataDate,
      });
    } catch (error) {
      console.log("Failed to save data", error);
    }
  };
  // Function to fetch sensor data
  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `https://api.thingspeak.com/channels/${process.env.NEXT_PUBLIC_CHANNEL_ID}/feeds.json?api_key=${process.env.NEXT_PUBLIC_API_KEY}&results=1`
      );
      const lastEntry = data.feeds[0];
      let newTemperature = Number(lastEntry.field1).toPrecision(4);
      let newHumidity = Number(lastEntry.field2).toPrecision(4);
      let newRainValue = Number(lastEntry.field3).toPrecision(4);

      if (
        newTemperature != localStorage.getItem("temperature") &&
        lastEntry.field1 !== "nan" &&
        lastEntry.field1
      ) {
        setTemperature(newTemperature);
        localStorage.setItem("temperature", newTemperature);
        saveInDatabase("updateTemperature", lastEntry);
      }
      if (
        newHumidity !== localStorage.getItem("humidity") &&
        lastEntry.field2 !== "nan" &&
        lastEntry.field2
      ) {
        setHumidity(newHumidity);
        localStorage.setItem("humidity", newHumidity);
        saveInDatabase("updateHumidity", lastEntry);
      }
      if (
        newRainValue !== localStorage.getItem("RainValue") &&
        lastEntry.field3 !== "nan" &&
        lastEntry.field3
      ) {
        setRainValue(newRainValue);
        localStorage.setItem("RainValue", newRainValue);
        saveInDatabase("updateRainValue", lastEntry);
      }

      let date = new Date(lastEntry.created_at);
      let kolkataTime = new Intl.DateTimeFormat("en-IN", options).format(date);
      setLastActive(kolkataTime);
      setStatus(200);
    } catch (error) {
      setStatus(error.response ? error.response.status : 500);
      // console.error("Error fetching sensor data:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-500 p-3">
      <div className="sm:pb-20 rounded-lg bg-[#f0f0f0] p-4 pb-14 sm:p-12 max-w-[1200px] w-full shadow-2xl">
        <h1 className="sm:mb-20 text-3xl mx-auto font-bold text-center max-w-lg text-gray-600 mb-12  shadow-md p-2">
          Real-Time Sensor Dashboard
        </h1>
        <div className=" sm:flex justify-around">
          <div className="space-y-6 sm:space-y-10  ">
            <Card img={TempImage} data={temperature} name={"Temperature"} />
            <Card img={HumidityImg} data={humidity} name={"Humidity"} />
            <Card img={rainImg} data={RainValue} name={"RainValue"} />
            <div
              className="flex items-center text-sm sm:text-base px-2 sm:px-4 py-2 mb-4 text-blue-700 bg-blue-100 border border-blue-300 rounded-lg "
              role="alert"
            >
              <HiMiniInformationCircle className="w-6 h-6 mr-2" />
              <div>
                <p className="">Last Sensor Activity at {`${lastActive}`}</p>
              </div>
            </div>
            <div className="hidden md:block">
              <ThingSpeakDataDownloader />
            </div>
            <div className="sm:space-y-10 block md:hidden ">
              <Chart fieldValue={1}></Chart>
              <Chart fieldValue={2}></Chart>
              <Chart fieldValue={3}></Chart>
            </div>
          </div>
          <div className="block md:hidden -mt-8 ">
            <ThingSpeakDataDownloader />
          </div>
          <div className="sm:space-y-10 hidden md:block">
            <Chart fieldValue={1}></Chart>
            <Chart fieldValue={2}></Chart>
            <Chart fieldValue={3}></Chart>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="no-wrap-toast"
      />
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
