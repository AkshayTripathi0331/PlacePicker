import { useEffect } from "react";
import ProgreesBar from "./ProgressBar";

const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  // const [remainingTime, setRemainingTime] = useState(TIMER);

  //an now we have to change remaining time at every second for that we will use useInteval();

  // useEffect(() => {
  //   //using below alone makes infinite loop so then we need to use useEffect and a return function
  //   const interval = setInterval(() => {
  //     console.log('INTERVAL');
  //     setRemainingTime((prevTime) => prevTime - 10);
  //   }, 10);

  //   //below is clean up function to avoid infinite interval
  //   return () => {
  //     clearInterval(interval);      
  //   };
  // }, []);

  // setTimeout(()=>{
  //   onConfirm();
  // },3000);

  useEffect(() => {
    console.log("TIMER SET");
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);

    // below function runs right before the above useEffect runs again or right before this component dismount
    return () => {
      console.log("TIMER CLEARED");
      clearTimeout(timer);
    };
  }, [onConfirm]);

  // when you are adding functions as a dependencies then there is a danger of infinite loop

  //since in every rendering life cycle onConfirm function ie treated as object by js thus its every time change in every life cycle where with the same value and body leads to infinte loop

  // but here we dont get case of infinite loop because state setModalIsOpen is set to false then DeleteComfirmation is then being removed from DOM

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      {/* <progress value={remainingTime} max={TIMER} /> */}
      <ProgreesBar timer={TIMER}/>
    </div>
  );
}
