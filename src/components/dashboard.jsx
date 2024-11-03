"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TempImage from "@/public/temperature.png";
import HumidityImg from "@/public/humidity.png";
import Card from "@/components/card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiMiniInformationCircle } from "react-icons/hi2";
import ThingSpeakDataDownloader from "@/components/downloadButton";
import Chart from "@/components/chart";

const Dashboard = () => {
  const [temperature, setTemperature] = useState(28.2);
  const [humidity, setHumidity] = useState(59);
  const [status, setStatus] = useState(null);
  const [lastActive, setLastActive] = useState(null);
  const prevStatusRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const temp = localStorage.getItem("temperature");
      const hum = localStorage.getItem("humidity");
      if (temp) setTemperature(temp);
      if (hum) setHumidity(hum);
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
      if (
        lastEntry.field1 !== temperature &&
        lastEntry.field1 !== "nan" &&
        lastEntry.field1
      ) {
        setTemperature(lastEntry.field1);
        localStorage.setItem("temperature", lastEntry.field1);
      }
      if (
        lastEntry.field2 !== humidity &&
        lastEntry.field2 !== "nan" &&
        lastEntry.field2
      ) {
        setHumidity(lastEntry.field2);
        localStorage.setItem("humidity", lastEntry.field2);
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
            </div>
          </div>
          <div className="block md:hidden -mt-8 ">
            <ThingSpeakDataDownloader />
          </div>
          <div className="sm:space-y-10 hidden md:block">
            <Chart fieldValue={1}></Chart>
            <Chart fieldValue={2}></Chart>
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

// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import TempImage from "@/public/temperature.png";
// import HumidityImg from "@/public/humidity.png";
// import Card from "@/components/card";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import io from "socket.io-client";
// import ThingSpeakDataDownloader from "@/components/downloadButton";
// import { HiMiniInformationCircle } from "react-icons/hi2";

// const Dashboard = () => {
//   const [temperature, setTemperature] = useState(28.2);
//   const [humidity, setHumidity] = useState(59);
//   const [status, setStatus] = useState(null);
//   const [lastActive, setLastActive] = useState(null);
//   // const [connected, setConnected] = useState(false);
//   const prevStatusRef = useRef(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const temp = localStorage.getItem("temperature");
//       const hum = localStorage.getItem("humidity");
//       if (temp) setTemperature(temp);
//       if (hum) setHumidity(hum);
//     }
//   }, []);

//   useEffect(() => {
//     // Connect to the Socket.IO server
//     const socket = io({
//       path: "/api/socket",
//     });

//     // Set up event listeners
//     socket.on("connect", () => {
//       setConnected(true);
//       console.log("Connected to server");
//     });

//     socket.on("sensorData", (response) => {
//       if (
//         response.lastEntry.feild1 !== temperature &&
//         response.lastEntry.feild1 !== "nan" &&
//         response.lastEntry.feild1
//       ) {
//         setTemperature(lastEntry.field1);
//         localStorage.setItem("temperature", response.lastEntry.feild1);
//       }
//       if (
//         response.lastEntry.feild2 !== humidity &&
//         response.lastEntry.feild2 !== "nan" &&
//         response.lastEntry.feild2
//       ) {
//         setHumidity(response.lastEntry.feild2);
//         localStorage.setItem("humidity", response.lastEntry.feild2);
//       }
//       let date = new Date(response.lastEntry.created_at);
//       let kolkataTime = new Intl.DateTimeFormat("en-IN", options).format(date);
//       setLastActive(kolkataTime);
//       setStatus(response.status);
//     });

//     socket.on("disconnect", () => {
//       setConnected(false);
//       console.log("Disconnected from server");
//     });

//     // Clean up on component unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     // Only notify if status has changed
//     if (prevStatusRef.current !== status) {
//       prevStatusRef.current = status; // Store the previous error state
//       let message = "";
//       if (status === 200) {
//         message = "Sensor readings fetched successfully 🎉";
//         notifySuccess(message);
//       } else if (status === 404) {
//         message = "Not found any sensor readings !";
//         notifyError(message);
//       } else {
//         message = "Error fetching sensor readings !";
//         notifyError(message);
//       }
//     }
//   }, [status]);

//   const notifyError = (msg) => {
//     toast.error(msg, {
//       position: "bottom-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//     });
//   };
//   const notifySuccess = (msg) => {
//     toast.success(msg, {
//       position: "bottom-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//     });
//   };

//   // Format the date for Kolkata time (IST) using Intl.DateTimeFormat
//   let options = {
//     timeZone: "Asia/Kolkata",
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//   };

//   // // Function to fetch sensor data
//   // const fetchData = async () => {
//   //   try {
//   //     const { data } = await axios.get(
//   //       `https://api.thingspeak.com/channels/${process.env.NEXT_PUBLIC_CHANNEL_ID}/feeds.json?api_key=${process.env.NEXT_PUBLIC_API_KEY}&results=1`
//   //     );
//   //     const lastEntry = data.feeds[0];
//   //     if (
//   //       lastEntry.field1 !== temperature &&
//   //       lastEntry.field1 !== "nan" &&
//   //       lastEntry.field1
//   //     ) {
//   //       setTemperature(lastEntry.field1);
//   //       localStorage.setItem("temperature", lastEntry.field1);
//   //     }
//   //     if (
//   //       lastEntry.field2 !== humidity &&
//   //       lastEntry.field2 !== "nan" &&
//   //       lastEntry.field2
//   //     ) {
//   //       setHumidity(lastEntry.field2);
//   //       localStorage.setItem("humidity", lastEntry.field2);
//   //     }
//   //     let date = new Date(lastEntry.created_at);
//   //     let kolkataTime = new Intl.DateTimeFormat("en-IN", options).format(date);
//   //     setLastActive(kolkataTime);
//   //     setStatus(200);
//   //   } catch (error) {
//   //     setStatus(error.response ? error.response.status : 500);
//   //     // console.error("Error fetching sensor data:", error);
//   //   }
//   // };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-500 p-5">
//       <div className=" rounded-lg bg-gray-50 p-4 pb-14 sm:p-12 max-w-xl w-full shadow-2xl">
//         <h1 className="text-3xl font-bold text-center text-gray-500 mb-16  shadow-md p-2">
//           Real-Time Sensor Dashboard
//         </h1>
//         <div className=" space-y-10">
//           <Card img={TempImage} data={temperature} name={"Temperature"} />
//           <Card img={HumidityImg} data={humidity} name={"Humidity"} />
//           <div
//             className="flex sm:max-w-fit items-center text-sm sm:text-base px-2 sm:px-4 py-2 mb-4 text-blue-700 bg-blue-100 border border-blue-300 rounded-lg text-center"
//             role="alert"
//           >
//             <HiMiniInformationCircle className="w-6 h-6 mr-2" />
//             <div>
//               <p className="">Last Sensor Activity at lallu lal ho kya {`${lastActive}`}</p>
//             </div>
//           </div>
//           <ThingSpeakDataDownloader />
//         </div>
//       </div>
//       <ToastContainer
//         position="bottom-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//         toastClassName="no-wrap-toast"
//       />
//       <ToastContainer />
//     </div>
//   );
// };

// export default Dashboard;
