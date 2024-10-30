"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TempImage from "@/public/temperature.png";
// import HumidityImg from "@/public/humidity.png";
import Card from "@/components/card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [temperature, setTemperature] = useState(0);
  // const [humidity, setHumidity] = useState(0);
  const [status, setStatus] = useState(null);
  const [lastActive, setLastActive] = useState(null);
  const prevStatusRef = useRef(null);
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
      prevStatusRef.current = status; // Store the previous error state
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
      const lastEntry = data.feeds[0];
      // if (lastEntry.field1 !== humidity) {
      //   setHumidity(lastEntry.field1);
      // }
      if (lastEntry.field2 !== temperature) {
        setTemperature(lastEntry.field2);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-500">
      <div className=" rounded-lg  p-4 pb-14 sm:p-12 max-w-xl w-full shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-16 mt-4 shadow-md p-2">
          Real-Time Sensor Dashboard
        </h1>
        <div className="space-y-10">
          <Card img={TempImage} data={temperature} name={"Temperature"} />
          {/* <Card img={HumidityImg} data={humidity} name={"Humidity"} /> */}
          <p className="sm:ml-14 ml-3 sm:text-base text-sm">
            last time Sensor active at {`${lastActive}`}
          </p>
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
