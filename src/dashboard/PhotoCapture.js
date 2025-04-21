import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { getPredictedLabel } from '../utils/ImageValidator'; // ✅ path to your validator
import { updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../Configuration';
import './PhotoCapture.css';

const classLabels = ['Plastic Cover', 'Bottles', 'Glass','E-waste','Metals']; // ✅ must match your model

const PhotoCapture = ({ challengeId, userId, onComplete }) => {
    const webcamRef = useRef(null);
    const imgRef = useRef(null); // ✅ for prediction
    const [imageSrc, setImageSrc] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [challengeModel, setChallengeModel] = useState(null);
    const [model, setModel] = useState(null); // ✅ store model
    const [predictedLabel, setPredictedLabel] = useState(''); // ✅ display result
    const [expectedType, setExpectedType] = useState(''); // store expected type for validation
    const [challengeItem, setChallengeItem] = useState(''); // store challenge item for display

    useEffect(() => {
        const fetchChallengeDetails = async () => {
            try {
                const challengeRef = doc(db, 'Challenges', challengeId);
                const challengeSnap = await getDoc(challengeRef);
                if (challengeSnap.exists()) {
                    const data = challengeSnap.data();
                    setChallengeModel(data);
                    setChallengeItem(data.name); // assuming 'name' contains challenge item
                }
            } catch (error) {
                console.error("Error fetching challenge details:", error);
            }
        };

        const loadModel = async () => {
            try {
                await tf.setBackend('webgl');
                await tf.ready();
                const loadedModel = await tf.loadLayersModel(
                    'https://teachablemachine.withgoogle.com/models/4G-VYBnqa/model.json'
                );
                setModel(loadedModel);
                console.log("✅ Model loaded");
            } catch (err) {
                console.error("❌ Model load error:", err);
            }
        };

        if (challengeId) fetchChallengeDetails();
        loadModel();
    }, [challengeId]);

    const capture = () => {
        const image = webcamRef.current.getScreenshot();
        if (image) {
            setImageSrc(image);
            setIsCameraOpen(false);
        }
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setImageSrc(event.target.result);
            setIsCameraOpen(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!imageSrc || !challengeModel || !model) {
            alert('Please capture or upload an image first, or model/challenge data is missing.');
            return;
        }

        setLoading(true);
        setShowSuccess(false);
        setIsError(false);

        // Wait for image to load into DOM before running prediction
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
            // Predict the label
            const label = await getPredictedLabel(imgRef.current, model, classLabels);
            setPredictedLabel(label);

            // Fetch the challenge type to get expected label
            const typeRef = doc(db, 'ChallengeType', challengeModel.type);
            const typeSnap = await getDoc(typeRef);
            const expectedTypeData = typeSnap.exists() ? typeSnap.data().ChallengeTypeModel.ChallengeTypeName : null;
            setExpectedType(expectedTypeData);

            if (!expectedTypeData) {
                setIsError(true);
                setLoading(false);
                alert('Challenge type not found!');
                return;
            }

            // Validation: predicted label must match expected type
            if (label.trim().toLowerCase() !== expectedTypeData.trim().toLowerCase())
                {
                setIsError(true);
                setLoading(false);
                alert(`Invalid item! Expected: ${expectedTypeData}, but got: ${label}`);
                return;
            }

            // Proceed with reward logic
            const userRewardRef = doc(db, 'UserRewards', `${userId}_${challengeId}`);
            const userRewardSnap = await getDoc(userRewardRef);
            const userRewardData = userRewardSnap.exists() ? userRewardSnap.data() : null;

            let newProgress = userRewardData ? userRewardData.progress + 1 : 1;
            let status = newProgress >= parseInt(challengeModel.targetQuantity) ? 'completed' : 'in-progress';
            if (status === 'completed') newProgress = parseInt(challengeModel.targetQuantity);

            await setDoc(userRewardRef, {
                userId,
                challengeId,
                status,
                progress: newProgress,
                pointsAwarded: (newProgress / parseInt(challengeModel.targetQuantity)) * parseInt(challengeModel.points),
                dateStarted: userRewardData ? userRewardData.dateStarted : new Date().toISOString(),
                dateCompleted: status === 'completed' ? new Date().toISOString() : null,
            });

            setShowSuccess(true);
            onComplete();
        } catch (error) {
            console.error('Error during submission:', error);
            setIsError(true);
        }

        setLoading(false);
    };

    const closePopup = () => {
        setShowSuccess(false);
        setIsError(false);
        setPredictedLabel('');
        setImageSrc(null);
        setIsCameraOpen(false);
    };

    return (
        <div className="photo-capture-container">
            <div className="qr-button" onClick={() => setIsCameraOpen(true)}></div>
            <button className="submit-button" onClick={handleSubmit}>Submit Photo</button>

            {isCameraOpen && (
                <div className="photo-popup">
                    <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="webcam"
                        videoConstraints={{ facingMode: 'environment' }}
                    />
                    <div className="photo-options">
                        <button onClick={capture} className="capture-btn">Take Photo</button>
                        <label className="upload-btn">
                            Upload Image
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                </div>
            )}

            {imageSrc && (
                <>
                    <img
                        src={imageSrc}
                        alt="Captured"
                        ref={imgRef} // ✅ bind for prediction
                        className="qr-image-preview"
                        crossOrigin="anonymous"
                    />
                    {predictedLabel && (
                        <p style={{ marginTop: '10px', textAlign: 'center' }}>
                            🔍 Predicted: <strong>{predictedLabel}</strong>
                        </p>
                    )}
                </>
            )}

            {loading && (
                <>
                    <div className="loading-overlay"></div>
                    <div className="loading">
                        <div className="loading-s"></div>
                    </div>
                </>
            )}

            {showSuccess && (
                <div className="success-popup" style={{ width: '300px', height: 'auto' }}>
                    <p>✅ Photo submitted successfully!</p>
                    <p>Challenge: <strong>{challengeItem}</strong></p>
                    <p>Predicted: <strong>{predictedLabel}</strong></p>
                    <button onClick={closePopup} className="home-btn">Home</button>
                    <button onClick={closePopup} className="cancel-btn">Cancel</button>
                </div>
            )}

{isError && (
  <div className="error-popup" style={{ width: '320px', height: 'auto' }}>
    <p style={{ fontWeight: 'bold', color: '#dc3545', fontSize: '16px' }}>
      ❌ Invalid item!
    </p>
    <p>
      Expected: <strong>{expectedType}</strong>, but got: <strong>{predictedLabel}</strong>
    </p>
    <div style={{ marginTop: '12px' }}>
      <button onClick={closePopup} className="home-btn">Home</button>
      <button onClick={handleSubmit} className="try-again-btn">Try Again</button>
      <button onClick={closePopup} className="cancel-btn">Cancel</button>
    </div>
  </div>
)}

        </div>
    );
};

export default PhotoCapture;
