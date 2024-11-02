import React from "react";

export default function Chart({ fieldValue }) {
  return (
    <iframe
      className={`border w-[450px] h-[260px] sm:w-[550px] sm:h-[300px] border-gray-50  bg-gray-100 p-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out scale-[0.8] sm:mt-0 -mt-5 ${
        fieldValue === 2 && "-mt-6"
      } sm:scale-100`}
      style={{ border: "1px solid #cccccc" }}
      src={`https://thingspeak.com/channels/${
        process.env.NEXT_PUBLIC_CHANNEL_ID
      }/charts/${fieldValue}?title=${
        fieldValue === 2 ? "Humidity" : "Temperature"
      } Monitoring&width=550&height=300&dynamic=true&api_key=${
        process.env.NEXT_PUBLIC_API_KEY
      }`}
    ></iframe>
  );
}
