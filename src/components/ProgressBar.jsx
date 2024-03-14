import { useState, useEffect } from "react";

export default function ProgreesBar({ timer }) {
  const [remainingTime, setRemainingTime] = useState(timer);
  useEffect(() => {
    //using below alone makes infinite loop so then we need to use useEffect and a return function
    const interval = setInterval(() => {
      console.log('INTERVAL');
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);

    //below is clean up function to avoid infinite interval
    return () => {
      clearInterval(interval);      
    };
  }, []);

  return (
    <progress value={remainingTime} max={timer} />
  );
}
