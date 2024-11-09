import React, { useState } from "react";
import { downloadOptions } from "@/data/downloadOptionsData";
import { DatePickerWithRange } from "@/components/calenderComponent";
import { toast } from "react-toastify";

const ThingSpeakDataDownloader = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [startDate, setStartDate] = useState("2024-10-30%2015:48:00");
  const [endDate, setEndDate] = useState("2024-11-02%2015:48:00");

  const formatLocalDate = (localDate, addDate) => {
    // Create a Date object from the local date
    const date = new Date(localDate);

    // Add one day
    date.setDate(date.getDate() + addDate);
    // Extract date components in local time
    const year = date.getFullYear(); // Local year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Local month (0-11)
    const day = String(date.getDate()).padStart(2, "0"); // Local day
    const hours = "00"
    const minutes = "00"
    const seconds = "00"

    // Construct the desired format
    return `${year}-${month}-${day}%20${hours}:${minutes}:${seconds}`;
  };

  const handleDateRange = (dateRange) => {
    const start = dateRange?.from;
    const end = dateRange?.to;
    if (start && end) {
      setStartDate(formatLocalDate(start, 0));
      setEndDate(formatLocalDate(end, 1));
    } else if (start && !end) {
      setStartDate(formatLocalDate(start, 0));
      setEndDate(formatLocalDate(start, 1));
    } else if (!start && end) {
      setStartDate(formatLocalDate(end, 0));
      setEndDate(formatLocalDate(end, 1));
    } else {
      toast.error("Please select dates ,selected dates can not be empty");
    }
  };
  const notifyError = (msg) => {
    toast.info(msg)
  };
  const downloadData = async () => {
    setIsDownloading(true);

    try {
      const format = downloadOptions.find((opt) => opt.id === selectedFormat);
      // Construct the URL with query parameters
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        format: selectedFormat,
      }).toString();
      const url = `api/downloadReadings?${queryParams}`;

      const response = await fetch(url);
      if (response.status === 404) {
        notifyError("No readings found in the selected dates");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.text();
      const blob = new Blob([data], { type: format.mimeType });
      const link = document.createElement("a");

      const timestamp = new Date(Date.now() + (5 * 60 + 30) * 60 * 1000)
        .toISOString()
        .split(".")[0] // Remove milliseconds
        .replace("T", "_")
        .replace(/[:.]/g, "-")
        .split("Z")[0];
      link.download = `sensor_data_${timestamp}_IST.${format.extension}`;

      link.href = window.URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download data. Please check console for details.");
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
      }, 1500);
    }
  };

  return (
    <div className="sm:w-[420px] bg-[#fdfdfd] shadow-lg rounded-xl overflow-hidden border border-gray-200 border-t-4 mt-8 sm:mt-0 ">
      <div className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-center text-gray-800">
          Download Feed History
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {downloadOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedFormat(option.id)}
              className={`
                p-4 rounded-lg
                transition-all duration-300 ease-in-out
                flex flex-col items-center justify-center
                space-y-2 h-28
                ${
                  selectedFormat === option.id
                    ? "bg-blue-50 border-2 border-blue-500 transform scale-105"
                    : "bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                }
              `}
            >
              <div className="h-8 transition-transform duration-300 hover:scale-110">
                {option.icon}
              </div>
              <span className="font-medium text-sm text-center text-gray-700">
                {option.label}
              </span>
            </button>
          ))}
        </div>
        <DatePickerWithRange handleDateRange={handleDateRange} />
        <button
          onClick={downloadData}
          disabled={isDownloading}
          className={`
            w-full py-3 px-6 
            rounded-lg 
            text-white 
            font-semibold
            transition-all 
            duration-300 
            ease-in-out 
            transform 
            hover:scale-102
            focus:outline-none 
            flex items-center justify-center
            space-x-2
            ${
              isDownloading
                ? "bg-green-500 animate-pulse"
                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
            }
          `}
        >
          {isDownloading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download {selectedFormat.toUpperCase()} File</span>
            </>
          )}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Download sensor feed history for the selected range of dates in your
          preferred format.
        </p>
      </div>
    </div>
  );
};

export default ThingSpeakDataDownloader;
