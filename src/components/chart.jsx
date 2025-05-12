"use client";
import React, { useEffect, useState } from "react";

export default function Chart({ fieldValue }) {
  const [width, setWidth] = useState("550");
  const [height, setHeight] = useState("300");

  // Resize the chart based on window width
  useEffect(() => {
    // Check if window is defined to avoid SSR issues
    if (typeof window !== "undefined") {
      function resizeChart() {
        if (window.innerWidth <= 768) {
          setWidth("370");
          setHeight("230");
        } else {
          setWidth("550");
          setHeight("300");
        }
      }

      // Initial resize on component mount
      resizeChart();

      // Add event listener for resizing
      window.addEventListener("resize", resizeChart);

      // Cleanup on unmount
      return () => window.removeEventListener("resize", resizeChart);
    }
  }, []);
  return (
    <div className="flex justify-center items-center pb-5 -mx-2">
      <iframe
        className={`border w-[372px] h-[240px] sm:w-[550px] sm:h-[300px] border-gray-50  bg-gray-100 p-1 rounded-lg shadow-lg transition-transform transform sm:hover:scale-105 duration-300 ease-in-out`}
        src={`https://thingspeak.com/channels/${
          process.env.NEXT_PUBLIC_CHANNEL_ID
        }/charts/${fieldValue}?title=${
          fieldValue === 2
            ? "Temperature"
            : fieldValue === 3
            ? "Humidity"
            : fieldValue === 4
            ? "Rain"
            : "Light Intesity (LDR)"
        } Monitoring&width=${width}&height=${height}&dynamic=true&api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }`}
      ></iframe>
    </div>
  );
}
