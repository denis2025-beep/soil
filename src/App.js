import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const dataRef = ref(db, "GreenhouseData");
    onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      setData(val);
    });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Greenhouse Sensor Dashboard</h1>
      {data ? (
        <ul>
          <li>Moisture: {data.Moisture}%</li>
          <li>Temperature: {data.Temperature}°C</li>
          <li>EC: {data.EC}</li>
          <li>pH: {data.pH}</li>
          <li>Nitrogen: {data.Nitrogen}</li>
          <li>Phosphorus: {data.Phosphorus}</li>
          <li>Potassium: {data.Potassium}</li>
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
