"use client";

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialDays: number;
  initialHours: number;
  initialMinutes: number;
  initialSeconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialDays,
  initialHours,
  initialMinutes,
  initialSeconds
}) => {
  const [days, setDays] = useState(initialDays);
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else if (hours > 0) {
        setHours(hours - 1);
        setMinutes(59);
        setSeconds(59);
      } else if (days > 0) {
        setDays(days - 1);
        setHours(23);
        setMinutes(59);
        setSeconds(59);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [days, hours, minutes, seconds]);

  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <div className="flex justify-start gap-2 my-4">
      <div className="bg-white border border-red-100 rounded-md p-3 text-center">
        <div className="text-2xl font-bold text-red-600">{formatNumber(days)}</div>
        <div className="text-xs text-gray-500">Days</div>
      </div>
      <div className="text-2xl font-bold flex items-center text-red-600">:</div>
      <div className="bg-white border border-red-100 rounded-md p-3 text-center">
        <div className="text-2xl font-bold text-red-600">{formatNumber(hours)}</div>
        <div className="text-xs text-gray-500">Hrs</div>
      </div>
      <div className="text-2xl font-bold flex items-center text-red-600">:</div>
      <div className="bg-white border border-red-100 rounded-md p-3 text-center">
        <div className="text-2xl font-bold text-red-600">{formatNumber(minutes)}</div>
        <div className="text-xs text-gray-500">Min</div>
      </div>
      <div className="text-2xl font-bold flex items-center text-red-600">:</div>
      <div className="bg-white border border-red-100 rounded-md p-3 text-center">
        <div className="text-2xl font-bold text-red-600">{formatNumber(seconds)}</div>
        <div className="text-xs text-gray-500">Sec</div>
      </div>
    </div>
  );
};

export default CountdownTimer; 