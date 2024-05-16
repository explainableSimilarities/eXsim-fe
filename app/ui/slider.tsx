"use client";
import React, { useState } from "react";
import { Term } from "../models/models";

// mentre quando lo chiamo sul singolo atomo gli passerò l'indice dell'atomo all'interno della formula
export default function Slider({
  name,
  left,
  defaultValue,
  steps,
  callback,
}: {
  name: string;
  left: Term;
  defaultValue: number;
  steps: 2 | 3 | 4;
  callback: (name: string, id: Term, value: 0 | 1 | 2 | 3) => void;
}) {
  const [value, setValue] = useState(defaultValue); // Initial slider value

  const inRange = (initial: number): 0 | 1 | 2 | 3 => {
    if (steps === 2) {
      return initial == 0 ? 0 : 2;
    }
    if (steps === 3) {
      return initial == 6 ? 1 : initial == 0 ? 0 : 2;
    }

    return initial == 0 ? 0 : initial == 4 ? 1 : initial == 8 ? 2 : 3;
  };

  const handleChange = (e: any) => {
    const sliderValue = parseInt(e.target.value);
    const trueValue = inRange(parseInt(e.target.value));
  
    setValue(sliderValue);
    callback(name, left, trueValue);
  };

  return (
    <div className="w-full">
      <div className="w-full items-center px-4">
        {steps === 2 && (
          <input
            type="range"
            min="0"
            max="12"
            step="12"
            value={value}
            onChange={handleChange}
            className={
              `transition-all w-full h-1 rounded-lg appearance-none focus:outline-none accent-unical-red-700 ` +
              (value == 0 ? "bg-unical-red-200" : "bg-unical-red-600")
            }
          />
        )}
        {steps === 3 && (
          <input
            type="range"
            min="0"
            max="12"
            step="6"
            value={value}
            onChange={handleChange}
            className={
              `transition-all w-full h-1 rounded-lg appearance-none focus:outline-none accent-unical-red-700 ` +
              (value == 0
                ? "bg-unical-red-200"
                : value == 6
                ? "bg-unical-red-400"
                : "bg-unical-red-600")
            }
          />
        )}
        {steps === 4 && (
          <input
            type="range"
            min="0"
            max="12"
            step="4"
            value={value}
            onChange={handleChange}
            className={
              `transition-all w-full h-1 rounded-lg appearance-none focus:outline-none accent-unical-red-700 ` +
              (value < 3
                ? "bg-unical-red-200"
                : value >= 3 && value < 6
                ? "bg-unical-red-300"
                : value > 6 && value < 9
                ? "bg-unical-red-400"
                : "bg-unical-red-600")
            }
          />
        )}
      </div>

      <div className="flex justify-between mt-2 px-4">
        <span
          className={
            `` + (value != 0 ? "text-slate-400 dark:text-slate-400" : "")
          }
        >
          Min
        </span>
        <span
          className={
            `` + (value != 12 ? "text-slate-400 dark:text-slate-400" : "")
          }
        >
          Max
        </span>
      </div>
    </div>
  );
}
