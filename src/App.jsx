import { useRef, useState, useEffect, useCallback } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

//moves below code outside the app component so that below code runs only once during entire life cycle
const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];

const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id),
);

//functions in javascript are just values, specifically they are objects and a function inside component is recreated everytime the component is rendered in the browser

// since functions are objects in javascript and when we create two objects in js whether with the same shape and size they are treated as different
function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState([...storedPlaces]);

  //navigator is provider by the browser not by the react

  //but we are updating state that yeild to an infinite loop becuse whenever any state updates compenenet reexecutes thus crashes our applicaton and to solve this issue we use useEffect

  // useEffect does not returns any value unlinke useState or useRef

  //useEffect(function that wrap my sideEffect code , array of dependencies)

  // useEffect code runs after every App component execution finished

  // if dependencies changes then only useEffect re runs

  //empty dependency useEffect never re-executes only

  // all sideEffects function does not need useEffect because overusing useEffect is not a good practice

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude,
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  // useEffect(() => {
  //   const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];

  //   const storedPlaces = storedIds.map((id) =>
  //     AVAILABLE_PLACES.find((place) => place.id === id)
  //   );

  //   setPickedPlaces(storedPlaces);
  // }, []);

  function handleStartRemovePlace(id) {
    // modal.current.open();
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    // modal.current.close();
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // for nor losing the state on reload we uses Browser storage ie. localStorage(identifier, data that must be string it cant be an array or object)

    //below code is sideEffect but it does not need any useEffect because it run only when handleSelectPlace is called

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];

    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds]),
      );
    }
  }

  //using useCallback leads not to reacreate the function again again

  //so through useCallback react ensures that the inner function does not recreate itself and instead it stores it in internally in memory and reuses the stored function whenever the component function executes again

  // so yoy have to use useCallbaks whenever you are using function as a dependecy in useEffect

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current),
    );
    // modal.current.close();

    // commenting below leads to infinite loop without useCallbacks
    setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];

    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current)),
    );
  }, []);

  return (
    <>
      {/* <Modal ref={modal}> */}
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        {/* {modalIsOpen && (
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      )} */}
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
