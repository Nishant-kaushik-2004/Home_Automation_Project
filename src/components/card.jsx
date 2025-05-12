import Image from "next/image";
import React from "react";

export default function Card({ img, data, name }) {

  // Get background and border colors based on sensor type
  const getCardStyle = () => {
    switch (name) {
      case "Temperature":
        return {
          background: "bg-gradient-to-br from-red-50 to-red-100",
          border: "border-red-200",
          highlight: "hover:shadow-red-200",
        };
      case "Humidity":
        return {
          background: "bg-gradient-to-br from-emerald-50 to-green-100",
          border: "border-green-200",
          highlight: "hover:shadow-green-200",
        };
      case "Rain Value":
        return {
          background: "bg-gradient-to-br from-blue-50 to-blue-100",
          border: "border-blue-200",
          highlight: "hover:shadow-blue-200",
        };
      case "LDR Value":
        return {
          background: "bg-gradient-to-br from-yellow-50 to-yellow-100",
          border: "border-yellow-200",
          highlight: "hover:shadow-yellow-200",
        };
      default:
        return {
          background: "bg-gray-50",
          border: "border-gray-200",
          highlight: "hover:shadow-gray-200",
        };
    }
  };

  const style = getCardStyle();

  return (
    <div
      className={`relative items-center justify-between p-4  sm:p-6  ${style.background} ${style.border} ${style.highlight} rounded-lg hover:scale-105 transition-all duration-300 ease-in-out  shadow-md border overflow-hidden`}
    >
      <div className="flex items-center">
        <h2 className=" flex items-center text-xl sm:text-2xl font-semibold text-gray-700 gap-2">
          <Image alt={`${name} icon`} src={img} height={50}></Image>
          {name}
        </h2>
        <span
          className={`text-2xl sm:text-3xl font-bold text-blue-600 ml-auto ${
            name === "Rain Value" && "-pr-3"
          }`}
        >
          {Number(data).toFixed(1)}
          {`${
            name === "Temperature"
              ? "°C"
              : name === "Humidity"
              ? "%"
              : name === "Rain Value"
              ? " mm"
              : ""
          }`}
        </span>
      </div>
      <p className="text-gray-500 ml-10">Live {name} Reading</p>
      {/* Background decorative element */}
      <div
        className={`absolute -bottom-18 sm:-bottom-16  -right-14 w-30 h-30 rounded-full opacity-10 
         ${
           name === "Temperature"
             ? "bg-red-500"
             : name === "Humidity"
             ? "bg-emerald-500"
             : name === "Rain Value"
             ? "bg-blue-500"
             : "bg-amber-500"
         }`}
      ></div>
    </div>
  );
}

//   return (
//     <div
//       className={`group relative ${style.background} ${style.border} border rounded-xl p-5
//       transition-all duration-300 ease-in-out shadow-md ${style.highlight}
//       hover:shadow-lg hover:scale-102 cursor-pointer overflow-hidden`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Animated pulse indicator */}
//       {isPulsing && (
//         <div className="absolute top-3 right-3">
//           <span className="flex h-3 w-3">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
//           </span>
//         </div>
//       )}

//       {/* Card content with animation */}
//       <div className="flex flex-col space-y-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className={`p-2 rounded-full ${isHovered ? 'animate-pulse' : ''}`}>
//               {getIcon()}
//             </div>
//             <h2 className="text-xl font-semibold text-gray-800">
//               {name}
//             </h2>
//           </div>

//           <div className={`${getValueColor()} text-3xl font-bold transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
//             {Number(data.value).toFixed(2)}{data.unit}
//           </div>
//         </div>

//         <div className="pl-12">
//           <p className="text-gray-500 text-sm">
//             Live {name} Reading
//           </p>

//           {/* Animated bar indicator */}
//           <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
//             <div
//               className={`h-full ${name === "Temperature" ? "bg-red-400" :
//                 name === "Humidity" ? "bg-emerald-400" :
//                 name === "Rain Value" ? "bg-blue-400" : "bg-amber-400"}
//                 transition-all duration-1000 ease-out`}
//               style={{
//                 width: `${name === "Temperature" ? Math.min(data.value/50*100, 100) :
//                        name === "Humidity" ? data.value :
//                        Math.min(data.value/100*100, 100)}%`
//               }}
//             ></div>
//           </div>
//         </div>
//       </div>

//       {/* Background decorative element */}
//       <div
//         className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10
//         ${name === "Temperature" ? "bg-red-500" :
//           name === "Humidity" ? "bg-emerald-500" :
//           name === "Rain Value" ? "bg-blue-500" : "bg-amber-500"}`}
//       ></div>
//     </div>
//   );
// };
