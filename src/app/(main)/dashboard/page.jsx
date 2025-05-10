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
import LEDController from "@/components/LEDController";

const Dashboard = () => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [RainValue, setRainValue] = useState(0);
  const [ledStatus, setLEDStatus] = useState(0);
  const [ledBrightness, setLEDBrightness] = useState(0);
  const [status, setStatus] = useState(null);
  const [lastActive, setLastActive] = useState(null);
  const prevStatusRef = useRef(null);
  const temperatureStatusRef = useRef();
  const humidityStatusRef = useRef();
  const rainStatusRef = useRef();
  const ledStatusRef = useRef(ledStatus);
  const ledBrightnessRef = useRef(ledBrightness);

  // Update refs when state changes
  useEffect(() => {
    ledStatusRef.current = ledStatus;
  }, [ledStatus]);

  useEffect(() => {
    ledBrightnessRef.current = ledBrightness;
  }, [ledBrightness]);

  useEffect(() => {
    temperatureStatusRef.current = temperature;
  }, [temperature]);

  useEffect(() => {
    humidityStatusRef.current = humidity;
  }, [humidity]);

  useEffect(() => {
    rainStatusRef.current = RainValue;
  }, [RainValue]);

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
    const prev = temperatureStatusRef.current;

    if (prev === undefined) {
      temperatureStatusRef.current = temperature;
      return;
    }

    if (prev < 35 && temperature >= 35) {
      alert("It's a sunny day 🌤️! Temperature started rising 🥵");
    } else if (prev >= 35 && temperature < 35) {
      alert("Temperature has gone down! 🌡️🥳");
    }

    temperatureStatusRef.current = temperature;
  }, [temperature]);

  useEffect(() => {
    const prev = humidityStatusRef.current;

    if (prev === undefined) {
      humidityStatusRef.current = humidity;
      return;
    }

    if (prev < 65 && humidity >= 65) {
      alert("It's humid outside 😰! keeps rising 🤕");
    } else if (prev >= 65 && humidity < 65) {
      alert("It's less humid right now! 😎");
    }

    humidityStatusRef.current = humidity;
  }, [humidity]);

  useEffect(() => {
    const prev = rainStatusRef.current;

    if (prev === undefined) {
      rainStatusRef.current = RainValue;
      return;
    }

    if (prev > 600 && RainValue <= 600) {
      alert("It's raining outside 🌧️! Keep your umbrella near 🌂");
    } else if (prev <= 600 && RainValue > 600) {
      alert("Rain has almost stopped! ☂️🥳");
    }

    rainStatusRef.current = RainValue;
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

  // Function to fetch sensor data
  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `https://api.thingspeak.com/channels/${process.env.NEXT_PUBLIC_CHANNEL_ID}/feeds.json?api_key=${process.env.NEXT_PUBLIC_API_KEY}&results=1`
      );
      // console.log(data);
      const lastEntry = data.feeds[0];

      const toNum = (val) => Number(Number(val).toFixed(2));

      let newTemperature = toNum(lastEntry.field2);
      let newHumidity = toNum(lastEntry.field3);
      let newRainValue = toNum(lastEntry.field4);

      let newLEDstatus = Number(lastEntry.field5);
      let newLEDbrightness = Number(lastEntry.field1);

      if (
        !isNaN(newTemperature) &&
        !isNaN(newHumidity) &&
        !isNaN(newRainValue) &&
        (temperatureStatusRef.current !== newTemperature ||
          humidityStatusRef.current !== newHumidity ||
          rainStatusRef.current !== newRainValue)
      ) {
        setTemperature(newTemperature);
        setHumidity(newHumidity);
        setRainValue(newRainValue);
        saveInDatabase(lastEntry);
      }

      if (
        ledStatusRef.current !== newLEDstatus ||
        ledBrightnessRef.current !== newLEDbrightness
      ) {
        // console.log(
        //   "ledStatusRef.current -> ",
        //   ledStatusRef.current,
        //   " ledBrightnessRef.current ->",
        //   ledBrightnessRef.current
        // );
        setLEDStatus(newLEDstatus);
        setLEDBrightness(newLEDbrightness);
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
  // save data to mongoDB
  const saveInDatabase = async (data) => {
    // Assume `created_at` is in UTC
    let date = new Date(data.created_at);
    // Calculate Kolkata time by adding the offset (5 hours 30 minutes)
    let kolkataOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds
    let kolkataDate = new Date(date.getTime() + kolkataOffset);

    try {
      const response = await axios.post("api/storeInCloud", {
        field1: data.field2,
        field2: data.field3,
        field3: data.field4,
        created_at: kolkataDate,
      });
    } catch (error) {
      console.log("Failed to save data", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-500 p-3">
      <div className="p-4 pb-14 sm:pb-20 sm:pt-6 rounded-lg bg-[#f0f0f0] max-w-[1200px] w-full shadow-2xl">
        <h1 className="sm:mb-10 text-2xl mx-auto font-bold text-center max-w-lg text-gray-600 mb-8 shadow-md p-2">
          Real-Time Sensor Monitoring Interface
        </h1>
        <div className="sm:flex justify-around">
          <div className="space-y-6 sm:space-y-4">
            <Card img={TempImage} data={temperature} name={"Temperature"} />
            <Card img={HumidityImg} data={humidity} name={"Humidity"} />
            <Card img={rainImg} data={RainValue} name={"RainValue"} />

            {/* LED Control Area */}
            <LEDController
              temperature={temperature}
              humidity={humidity}
              RainValue={RainValue}
              ledBrightness={ledBrightness}
              ledStatus={ledStatus === 0 ? false : true}
            />

            <div
              className="flex items-center text-sm sm:text-base px-2 sm:px-4 py-2 mb-4 text-blue-700 bg-blue-100 border border-blue-300 rounded-lg"
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
            <div className="sm:space-y-0 block md:hidden">
              <Chart fieldValue={2}></Chart>
              <Chart fieldValue={3}></Chart>
              <Chart fieldValue={4}></Chart>
            </div>
          </div>
          <div className="block md:hidden -mt-8">
            <ThingSpeakDataDownloader />
          </div>
          <div className="sm:space-y-0 hidden md:block">
            <Chart fieldValue={2}></Chart>
            <Chart fieldValue={3}></Chart>
            <Chart fieldValue={4}></Chart>
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
