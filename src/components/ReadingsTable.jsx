// components/ReadingsTable.jsx
export default function ReadingsTable({ readings }) {
  if (!readings || readings.length === 0) {
    return <p className="no-data">No readings available</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="readings-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Moisture %</th>
            <th>Temperature °C</th>
            <th>EC µS/cm</th>
            <th>pH</th>
            <th>Nitrogen</th>
            <th>Phosphorus</th>
            <th>Potassium</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((reading, idx) => (
            <tr key={idx}>
              <td>{new Date(reading.timestamp).toLocaleString()}</td>
              <td>{reading.moisture.toFixed(1)}</td>
              <td>{reading.temperature.toFixed(1)}</td>
              <td>{reading.ec.toFixed(0)}</td>
              <td>{reading.ph.toFixed(2)}</td>
              <td>{reading.nitrogen.toFixed(0)}</td>
              <td>{reading.phosphorus.toFixed(0)}</td>
              <td>{reading.potassium.toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
