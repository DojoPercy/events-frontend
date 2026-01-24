"use client";

import { useEffect, useState } from "react";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  eventDate: Date | string;
}

export function CountdownTimer({ eventDate }: CountdownTimerProps) {
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const eventTime = new Date(eventDate).getTime();
      const distance = eventTime - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  if (
    countdown.days === 0 &&
    countdown.hours === 0 &&
    countdown.minutes === 0 &&
    countdown.seconds === 0
  ) {
    return null;
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto mt-8 sm:mt-12 px-4">
      {[
        { label: "Days", value: countdown.days },
        { label: "Hours", value: countdown.hours },
        { label: "Minutes", value: countdown.minutes },
        { label: "Seconds", value: countdown.seconds },
      ].map((item) => (
        <div
          key={item.label}
          className="bg-white/20 backdrop-blur rounded-lg p-3 sm:p-4"
        >
          <div className="text-2xl sm:text-4xl font-bold">{item.value}</div>
          <div className="text-xs sm:text-sm opacity-90">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
