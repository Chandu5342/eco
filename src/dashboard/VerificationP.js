import './VerificationP.css';
import React, { useState } from 'react';
import Webcam from "react-webcam";
import jsQR from 'jsqr';
import { addDoc, collection, getDocs, query,getDoc,doc } from "firebase/firestore";
import { auth, db } from "../Configuration";


function VerificationP() {
    const [scanResult, setScanResult] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const webcamRef = React.useRef(null);

    const videoConstraints = {
        width: 500,
        height: 500,
        facingMode: "environment"
    };

    const handleScanClick = () => {
        setShowScanner(true);
    };

    const closeScanner = () => {
        setShowScanner(false);
    };

    const captureAndScan = async () => {
        let attempts = 0;
        let imageSrc = null;

        while (attempts < 5 && !imageSrc) {
            imageSrc = webcamRef.current?.getScreenshot();
            attempts++;
            if (!imageSrc) {
                console.log("Waiting for camera to stabilize...");
                await new Promise(res => setTimeout(res, 500));
            }
        }

        if (!imageSrc) {
            alert("Unable to capture image from webcam. Try again.");
            return;
        }

        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert"
            });

            if (code) {
                const docId = extractDocId(code.data);
                setScanResult(docId);
                alert(`Scanned Doc ID: ${docId}`);
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
        reader.onload = function (event) {
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
                    alert("QR code not detected in the uploaded image.");
                }
            };
        };
        reader.readAsDataURL(file);
    };

    const extractDocId = (url) => {
        try {
            const parsedUrl = new URL(url);
            const params = new URLSearchParams(parsedUrl.search);
            return params.get('data') || url.split('/').pop();
        } catch (e) {
            return url;
        }
    };
    function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    
    const handleSubmit = async () => {
        if (!scanResult.trim()) {
            alert("Please scan or enter QR code");
            return;
        }
    
        try {
            const docRef = doc(db, "Dustbins", scanResult);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                alert("Dustbin not found in database.");
                return;
            }
    
            const dustbinData = docSnap.data();
            const dustbinLat = parseFloat(dustbinData.DustbinModel?.Latitude);
            const dustbinLng = parseFloat(dustbinData.DustbinModel?.Longitude);
    
            if (isNaN(dustbinLat) || isNaN(dustbinLng)) {
                alert("Invalid dustbin coordinates.");
                return;
            }
    
            if (!navigator.geolocation) {
                alert("Geolocation is not supported by your browser.");
                return;
            }
    
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    const accuracy = position.coords.accuracy;
    
                    const distance = getDistanceFromLatLonInMeters(userLat, userLng, dustbinLat, dustbinLng);
    
                    console.log(`User Location: ${userLat}, ${userLng} (accuracy: ${accuracy} meters)`);
                    console.log(`Dustbin Location: ${dustbinLat}, ${dustbinLng}`);
                    console.log(`Distance to dustbin: ${distance} meters`);
    
                    if (accuracy > 50) {
                        alert(`GPS accuracy is low (${accuracy} meters). Try moving near a window or open area.`);
                        return;
                    }
    
                    if (distance <= 500) {
                        alert(`✅ Success! You're near the dustbin.\nDistance: ${distance.toFixed(2)} meters\nAccuracy: ${accuracy.toFixed(2)} meters`);
                    } else {
                        alert(`❌ Too far from dustbin.\nDistance: ${distance.toFixed(2)} meters\nYour Location: ${userLat}, ${userLng}\nDustbin Location: ${dustbinLat}, ${dustbinLng}`);
                    }
                },
                (error) => {
                    alert("Failed to get your location. Please allow GPS.");
                    console.error("Geolocation error:", error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
    
        } catch (error) {
            console.error("Error during verification:", error);
            alert("Something went wrong.");
        }
    };
    
    
    

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

            {/* SCANNER MODAL */}
            {showScanner && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={closeScanner}>X</button>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="upload-input"
                            onChange={(e) => handleImageUpload(e)}
                        />
                        <label htmlFor="upload-input" className="upload-label">
                            📷 Upload Image
                        </label>
                        <button className="scan-btn" onClick={captureAndScan}>Scan Now</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VerificationP;
