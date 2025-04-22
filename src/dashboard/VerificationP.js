import './VerificationP.css';
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters
import Webcam from "react-webcam";
import jsQR from 'jsqr';
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../Configuration";
import PhotoCapture from './PhotoCapture';
import UploadVerifier from './UploadVerifier ';

function VerificationP() {
    const { challengeId, userId } = useParams(); // Get challengeId and userId from URL params
    const [scanResult, setScanResult] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [step, setStep] = useState('verify');
    const [imf, setimf] = useState(0);
    const webcamRef = useRef(null);
    const videoConstraints = {
        width: 500,
        height: 500,
        facingMode: "environment"
    };
  
    useEffect(() => {
        console.log(`Challenge ID: ${challengeId}, User ID: ${userId}`);
    }, [challengeId, userId]);

    const handleScanClick = () => setShowScanner(true);
    const closeScanner = () => setShowScanner(false);

    const extractDocId = (url) => {
        try {
            const parsedUrl = new URL(url);
            const params = new URLSearchParams(parsedUrl.search);
            return params.get('data') || url.split('/').pop();
        } catch (e) {
            return url;
        }
    };

    const deg2rad = (deg) => deg * (Math.PI / 180);
    const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
        const R = 6371000; // Earth radius in meters
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) ** 2;
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    const captureAndScan = async () => {
        let attempts = 0;
        let imageSrc = null;

        while (attempts < 5 && !imageSrc) {
            imageSrc = webcamRef.current?.getScreenshot();
            attempts++;
            await new Promise(res => setTimeout(res, 500));
        }

        if (!imageSrc) {
            alert("Unable to capture image. Please try again.");
            return;
        }

        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert"
            });

            if (code) {
                const docId = extractDocId(code.data);
                setScanResult(docId);
                alert(`QR Code scanned: ${docId}`);
                closeScanner();
            } else {
                alert("QR code not detected. Try again.");
            }
        };
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const image = new Image();
            image.src = event.target.result;

            image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height, {
                    inversionAttempts: "dontInvert"
                });

                if (code) {
                    const docId = extractDocId(code.data);
                    setScanResult(docId);
                    alert(`Scanned from upload: ${docId}`);
                    closeScanner();
                } else {
                    alert("QR code not detected in uploaded image.");
                }
            };
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!scanResult.trim()) {
            alert("Please scan or enter a QR code.");
            return;
        }

        setLoading(true);
        setShowSuccess(false);

        try {
            const docRef = doc(db, "Dustbins", scanResult);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                setLoading(false);
                alert("Dustbin not found in the database.");
                return;
            }

            const { Latitude, Longitude } = docSnap.data().DustbinModel || {};
            const dustbinLat = parseFloat(Latitude);
            const dustbinLng = parseFloat(Longitude);

            if (isNaN(dustbinLat) || isNaN(dustbinLng)) {
                setLoading(false);
                alert("Invalid coordinates in the database.");
                return;
            }

            if (!navigator.geolocation) {
                setLoading(false);
                alert("Geolocation is not supported by your browser.");
                return;
            }

        // Keep everything same except this line for extra feedback during geolocation error
navigator.geolocation.getCurrentPosition(
    (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const distance = getDistanceInMeters(userLat, userLng, dustbinLat, dustbinLng);

        setLoading(false);

        if (distance <= 500) {
            setIsError(false);
            setShowSuccess(true);
        } else {
            setIsError(true);
            setShowSuccess(true);
        }
    },
    (error) => {
        setLoading(false);
        alert("Unable to retrieve your location. Please ensure GPS is enabled and try again.");
        console.error("Geolocation Error: ", error);
    }
);


        } catch (error) {
            console.error("Error verifying location:", error);
            setLoading(false);
            alert("An error occurred. Please try again.");
        }
    };

    const updateUserTaskStatus = async () => {
        try {
            const userDocRef = doc(db, "Users", userId);
            await updateDoc(userDocRef, {
                [`tasks.${challengeId}`]: 'completed'
            });
            alert("Task completed successfully!");
        } catch (error) {
            console.error("Error updating task status:", error);
            alert("Error updating task status. Please try again.");
        }
    };

    const handlePhotoSubmit = async (img) => {
        await updateUserTaskStatus();
        setStep('completed');
    };

    if (step === 'photo') {
         return (
            <PhotoCapture
              onBack={() => setStep('verify')}
              onSubmit={handlePhotoSubmit}
              userId={userId}
              challengeId={challengeId}
              onComplete={() => console.log("✅ Photo capture complete!")} // <-- ADD THIS
            />
          );
          
        
    }

    // if(imf===1)
    // {
    //     return(
    //                     <UploadVerifier
    //         userId={userId}
    //         challengeId={challengeId}
    //         binId={scanResult}
    //         />
    //     )
    // }
    return (
        <div className="verification-container">
         
            <div className="vc">
                <h1 className="heading">RECYCLING CHALLENGE</h1>
                <input
                    type="text"
                    placeholder="Enter QR Code Here"
                    className="qr-input"
                    value={scanResult}
                    onChange={(e) => setScanResult(e.target.value)}
                />
                <div className="btn-group">
                    <button className="scan-btn" onClick={handleScanClick}>Scan</button>
                    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                </div>
            </div>

            {loading && (
                <div className="overlay-popup">
                    <div className="loader-circle"></div>
                    <p>Verifying...</p>
                </div>
            )}

{showSuccess && (
    <div className={`toast-rectangle ${isError ? 'error' : 'success'}`}>
        <div className="toast-content">
            <div className="icon">{isError ? "❌" : "✔"}</div>
            <div className="message">
                <p>{isError ? "Too far from dustbin!" : "Success!"}</p>
                <div className="toast-buttons">
                    {isError ? (
                        <button onClick={() => setShowSuccess(false)}>Try Again</button>
                    ) : (
                        <>
                            <button onClick={() => setStep('photo')}>Next</button>
                            <button onClick={() => setShowSuccess(false)}>Cancel</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
)}



            {showScanner && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setShowScanner(false)}>X</button>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            id="upload-input"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="upload-input" className="upload-label">📷 Upload Image</label>
                        <button className="scan-btn" onClick={captureAndScan}>Scan Now</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VerificationP;