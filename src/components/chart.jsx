"use client"
import React, { useState } from "react";

export default function Chart({ fieldValue }) {
  const [width, setWidth] = useState("550");
  const [height, setHeight] = useState("300");

  // Function to resize the Thingspeak chart based on window width
  function resizeChart() {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      // Mobile view
      setWidth("450");
      setHeight("280");
    }
  }
  // Resize on page load and when window is resized
  window.addEventListener("load", resizeChart);
  window.addEventListener("resize", resizeChart);
  return (
    <div className="flex justify-center items-center pb-5 -mx-2">
      <iframe
        className={`border w-[450px] h-[230px] sm:w-[550px] sm:h-[300px] border-gray-50  bg-gray-100 p-1 rounded-lg shadow-lg transition-transform transform sm:hover:scale-105 duration-300 ease-in-out`}
        src={`https://thingspeak.com/channels/${
          process.env.NEXT_PUBLIC_CHANNEL_ID
        }/charts/${fieldValue}?title=${
          fieldValue === 2 ? "Humidity" : "Temperature"
        } Monitoring&width=${width}&height=${height}&dynamic=true&api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }`}
      ></iframe>
    </div>
  );
}
