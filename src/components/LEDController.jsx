import { useState, useEffect } from "react";
import { Power, Sun } from "lucide-react";
import axios from "axios";

export default function LEDController({
  temperature,
  humidity,
  RainValue,
  ledBrightness,
  ledStatus,
}) {
  const [isOn, setIsOn] = useState(ledStatus);
  const [brightness, setBrightness] = useState(ledBrightness);
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    setIsOn(ledStatus);
  }, [ledStatus]);

  useEffect(() => {
    setBrightness(ledBrightness);
  }, [ledBrightness]);

  // Animate the LED when turning on/off or changing brightness
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [isOn, brightness]);

  // Calculate LED glow based on whether it's on and brightness level
  const ledGlowColor = isOn
    ? `rgba(255, 0, 0, ${brightness / 100})`
    : "rgba(100, 0, 0, 0.1)";

  // Toggle the LED state
  const handleToggle = async () => {
    const newStatus = !isOn;
    setIsOn(newStatus);

    try {
      const { data } = await axios.get(
        `https://api.thingspeak.com/update?api_key=${
          process.env.NEXT_PUBLIC_WRITE_API_KEY
        }&field1=${brightness}&field2=${temperature}&field3=${humidity}&field4=${RainValue}&field5=${
          newStatus ? 1 : 0
        }`
      );
      console.log("LED toggle response:", data);
    } catch (error) {
      console.error("Error toggling LED ->", error);
    }
  };

  // Update brightness value
  const handleBrightnessChange = async (e) => {
    setBrightness(parseInt(e.target.value));
    try {
      const { data } = await axios.get(
        `https://api.thingspeak.com/update?api_key=${
          process.env.NEXT_PUBLIC_WRITE_API_KEY
        }&field1=${e.target.value}&field2=${temperature}&field3=${humidity}&field4=${RainValue}&field5=${
          isOn ? 1 : 0
        }`
      );
      console.log("brightness change response:", data);
    } catch (error) {
      console.log("Error updating brightness -> ", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">LED Controller</h2>

      {/* LED Visualization */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-full bg-red-800 flex items-center justify-center transition-all duration-300 ${
              isAnimating ? "scale-110" : ""
            }`}
            style={{
              boxShadow: `0 0 30px 5px ${ledGlowColor}, 0 0 10px ${ledGlowColor} inset`,
            }}
          >
            <div
              className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center"
              style={{ opacity: isOn ? brightness / 100 : 0.2 }}
            >
              <div
                className="w-8 h-8 rounded-full bg-red-400"
                style={{ opacity: isOn ? brightness / 100 : 0.1 }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Display */}
      <div className="flex justify-between items-center mb-6 bg-gray-800 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gray-400">Status</p>
          <p className="text-lg font-medium flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                isOn ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {isOn ? "ON" : "OFF"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Brightness</p>
          <p className="text-lg font-medium">{brightness}%</p>
        </div>
      </div>

      {/* Brightness Slider */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Sun size={16} className="text-yellow-400 mr-2" />
          <label htmlFor="brightness" className="text-sm text-gray-300">
            Brightness Control
          </label>
        </div>
        <input
          type="range"
          id="brightness"
          min="0"
          max="100"
          value={brightness}
          onChange={handleBrightnessChange}
          disabled={!isOn}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Power Button */}
      <button
        onClick={handleToggle}
        className={`w-full py-3 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isOn ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        <Power size={20} className="mr-2" />
        {isOn ? "Turn OFF" : "Turn ON"}
      </button>
    </div>
  );
}
