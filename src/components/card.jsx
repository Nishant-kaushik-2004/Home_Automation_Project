import Image from "next/image";
import React from "react";

export default function Card({ img, data, name }) {
  return (
    <div
      className={`items-center justify-between p-4 sm:p-6 ${
        name === "Temperature" ? "bg-blue-200" : "bg-green-200"
      } rounded-lg hover:scale-105 transition-all shadow-md hover:shadow-xl `}
    >
      <div className="flex items-center">
        <h2 className=" flex items-center text-xl font-semibold text-gray-700 gap-2">
          <Image alt={`${name} icon`} src={img} height={50}></Image>
          {name}
        </h2>
        <span className="text-2xl sm:text-3xl font-bold text-blue-500 ml-auto sm:pr-10">
          {Number(data).toPrecision(3)}
          {`${name === "Temperature" ? "°C" : "%"}`}
        </span>
      </div>
      <p className="text-gray-500 ml-10">Live {name} Reading</p>
    </div>
  );
}
