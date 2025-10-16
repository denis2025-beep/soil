// src/App.js
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import database from "./firebase";

function App() {
  const [sensorData, setSensorData] = useState({});

  useEffect(() => {
    const sensorRef = ref(database, "sensorData/latest"); // if using latest node
    onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        setSensorData(snapshot.val());
      }
    });
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>🌱 Smart Soil Monitor</h1>
      <div>
        <p>💧 Moisture: {sensorData.moisture ?? "–"}%</p>
        <p>🌡️ Temperature: {sensorData.temperature ?? "–"} °C</p>
        <p>⚡ EC: {sensorData.ec ?? "–"} µS</p>
        <p>🧪 pH: {sensorData.ph ?? "–"}</p>
        <p>🌿 Nitrogen: {sensorData.nitrogen ?? "–"} ppm</p>
        <p>🍃 Phosphorus: {sensorData.phosphorus ?? "–"} ppm</p>
        <p>🌾 Potassium: {sensorData.potassium ?? "–"} ppm</p>
        <p>⏱ Timestamp: {sensorData.timestamp_iso ?? "–"}</p>
      </div>
    </div>
  );
}

export default App;
