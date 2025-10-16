// services/firebaseService.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, query, orderByChild, limitToLast, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Get latest sensor readings
export const getLatestReadings = async (deviceId = 'device_001') => {
  try {
    const readingsRef = ref(database, `devices/${deviceId}/readings`);
    const q = query(readingsRef, orderByChild('timestamp'), limitToLast(1));
    const snapshot = await get(q);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data)[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching latest readings:', error);
    throw error;
  }
};

// Subscribe to real-time updates
export const subscribeToRealTimeReadings = (deviceId = 'device_001', callback) => {
  const readingsRef = ref(database, `devices/${deviceId}/readings`);
  const q = query(readingsRef, orderByChild('timestamp'), limitToLast(50));
  
  const unsubscribe = onValue(readingsRef, (snapshot) => {
    if (snapshot.exists()) {
      const readings = Object.values(snapshot.val()).sort((a, b) => a.timestamp - b.timestamp);
      callback(readings);
    }
  }, (error) => {
    console.error('Real-time subscription error:', error);
  });

  return unsubscribe;
};

// Get historical data for date range
export const getHistoricalData = async (deviceId = 'device_001', startDate, endDate) => {
  try {
    const readingsRef = ref(database, `devices/${deviceId}/readings`);
    const snapshot = await get(readingsRef);
    
    if (snapshot.exists()) {
      const allReadings = Object.values(snapshot.val());
      const filtered = allReadings.filter(reading => 
        reading.timestamp >= startDate.getTime() && 
        reading.timestamp <= endDate.getTime()
      );
      return filtered.sort((a, b) => a.timestamp - b.timestamp);
    }
    return [];
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

// Get device info
export const getDeviceInfo = async (deviceId = 'device_001') => {
  try {
    const deviceRef = ref(database, `devices/${deviceId}/info`);
    const snapshot = await get(deviceRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error fetching device info:', error);
    throw error;
  }
};

// Get all devices
export const getAllDevices = async () => {
  try {
    const devicesRef = ref(database, 'devices');
    const snapshot = await get(devicesRef);
    
    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};

// Calculate statistics
export const calculateStats = (readings) => {
  if (!readings || readings.length === 0) return null;

  const moisture = readings.map(r => r.moisture);
  const temperature = readings.map(r => r.temperature);
  const ph = readings.map(r => r.ph);
  const ec = readings.map(r => r.ec);

  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const min = (arr) => Math.min(...arr);
  const max = (arr) => Math.max(...arr);

  return {
    moisture: { avg: avg(moisture), min: min(moisture), max: max(moisture) },
    temperature: { avg: avg(temperature), min: min(temperature), max: max(temperature) },
    ph: { avg: avg(ph), min: min(ph), max: max(ph) },
    ec: { avg: avg(ec), min: min(ec), max: max(ec) },
  };
};

export { database, auth };
