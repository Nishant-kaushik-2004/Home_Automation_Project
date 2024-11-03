import React from "react";

export default function Chart({ fieldValue }) {
  return (
    <div className="flex justify-center items-center pb-5">
      <iframe
        className={`border w-[550px] h-[320px] sm:w-[550px] sm:h-[300px] border-gray-50  bg-gray-100 p-2 rounded-lg shadow-lg transition-transform transform sm:hover:scale-105 duration-300 ease-in-out scale-[1]  sm:scale-100`}
        style={{ border: "1px solid #cccccc" }}
        src={`https://thingspeak.com/channels/${
          process.env.NEXT_PUBLIC_CHANNEL_ID
        }/charts/${fieldValue}?title=${
          fieldValue === 2 ? "Humidity" : "Temperature"
        } Monitoring&width=550&height=300&dynamic=true&api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }`}
      ></iframe>
    </div>
  );
}
