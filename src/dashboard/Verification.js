import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Configuration"; // Make sure db is correctly configured
import { toast } from "react-toastify";
import { QrReader } from 'react-qr-reader';


import './Verification.css'; // Make sure to include your custom styles for this component

function VerifyRecycling() {
  const [step, setStep] = useState(1); // Manage the steps in the process (QR scan, image upload, reward)
  const [dustbinId, setDustbinId] = useState(""); // Store scanned or entered dustbin ID
  const [scanning, setScanning] = useState(false); // Toggle for QR scan
  const [dustbinData, setDustbinData] = useState(null); // Store fetched dustbin data
  const [userLocation, setUserLocation] = useState({ lat: "", lon: "" }); // Store user's location
  const [productImage, setProductImage] = useState(null); // Store uploaded product image

  // Function to fetch dustbin details from Firestore based on the scanned QR code ID
  const fetchDustbinDetails = async (id) => {
    try {
      const docRef = doc(db, "Dustbins", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDustbinData(data.DustbinModel); // Set dustbin data (model)
        toast.success("Dustbin data found!");
      } else {
        toast.error("Invalid QR code or Dustbin not found.");
      }
    } catch (e) {
      toast.error("Error fetching dustbin details.");
    }
  };

  // Function to fetch user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLocation({ lat, lon }); // Store latitude and longitude
        },
        () => {
          toast.error("Failed to get user location.");
        }
      );
    }
  };

  // Function to check if user is at the correct dustbin location
  const checkLocationMatch = () => {
    const threshold = 0.0015; // Define a threshold for matching location (distance in degrees)
    const isNearby =
      Math.abs(dustbinData.Latitude - userLocation.lat) < threshold &&
      Math.abs(dustbinData.Longitude - userLocation.lon) < threshold;

    if (isNearby) {
      toast.success("You are at the correct dustbin location!");
      setStep(2); // Move to next step (upload image)
    } else {
      toast.error("You are not at the correct dustbin location.");
    }
  };

  // Effect to check location after fetching dustbin data and user's location
  useEffect(() => {
    if (dustbinData && userLocation.lat) {
      checkLocationMatch(); // Check location match
    }
  }, [dustbinData, userLocation]);

  const handleScan = (result) => {
    if (result?.text) {
      try {
        const parsedData = JSON.parse(result.text);
        const id = parsedData?.id || parsedData; // support for plain string or object with id
        setDustbinId(id);
        setScanning(false);
        fetchDustbinDetails(id);
        getUserLocation();
      } catch (err) {
        console.error("Invalid QR Code content: not JSON");
        // fallback: treat as plain text
        setDustbinId(result.text);
        setScanning(false);
        fetchDustbinDetails(result.text);
        getUserLocation();
      }
    }
  };


  // Handle error in QR scanning
  const handleError = (err) => {
    console.error(err);
    toast.error("QR Scan error");
  };

  // Handle file upload (product image)
  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]); // Set the uploaded image
  };

  // Handle product verification (uploaded image check)
  const handleVerifyProduct = () => {
    if (productImage) {
      toast.success("Product uploaded. Verification passed!");
      setStep(3); // Move to next step (reward section)
    } else {
      toast.error("Please upload a product image.");
    }
  };

  return (
    <div className="verify-container">
      <h2>♻️ Recycling Verification</h2>

      {/* Step 1: QR code scanning or entering dustbin ID */}
      {step === 1 && (
        <>
          {!scanning ? (
            <>
              <input
                type="text"
                placeholder="Enter Dustbin QR Code ID"
                value={dustbinId}
                onChange={(e) => setDustbinId(e.target.value)} // Update dustbin ID on change
              />
              <button onClick={() => {
                fetchDustbinDetails(dustbinId); // Fetch details for entered ID
                getUserLocation(); // Get user location
              }}>
                Next
              </button>
              <p>or</p>
              <button onClick={() => setScanning(true)}>Scan QR Code</button>
            </>
          ) : (
            <div>
              <QrReader
                onResult={(result, error) => {
                  if (!!result) {
                    handleScan(result);
                  }
                  if (!!error) {
                    handleError(error);
                  }
                }}
                constraints={{ facingMode: 'environment' }}
                style={{ width: '100%' }}
              />

              <button onClick={() => setScanning(false)}>Cancel Scan</button>
            </div>
          )}
        </>
      )}

      {/* Step 2: Product upload */}
      {step === 2 && (
        <div className="upload-section">
          <h3>Upload Recycled Product</h3>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          {productImage && <p>Selected: {productImage.name}</p>}
          <button onClick={handleVerifyProduct}>Submit</button>
        </div>
      )}

      {/* Step 3: Reward section */}
      {step === 3 && (
        <div className="reward-section">
          <h3>🎉 Congratulations!</h3>
          <p>You’ve earned 10 Green Points for this challenge.</p>
        </div>
      )}
    </div>
  );
}

export default VerifyRecycling;
