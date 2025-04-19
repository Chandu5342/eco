import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../Configuration';
import './PhotoCapture.css';

const PhotoCapture = ({ challengeId, userId, onComplete }) => {
    const webcamRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [challengeModel, setChallengeModel] = useState(null);

    useEffect(() => {
        const fetchChallengeDetails = async () => {
            try {
                const challengeRef = doc(db, 'Challenges', challengeId);
                const challengeSnap = await getDoc(challengeRef);
                if (challengeSnap.exists()) setChallengeModel(challengeSnap.data());
            } catch (error) {
                console.error("Error fetching challenge details:", error);
            }
        };

        if (challengeId) fetchChallengeDetails();
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
        if (!imageSrc || !challengeModel) {
            alert('Please capture or upload an image first, or challenge data is missing.');
            return;
        }

        setLoading(true);
        setShowSuccess(false);
        setTimeout(async () => {
            setLoading(false);
            setShowSuccess(true);
            try {
                const userRewardRef = doc(db, 'UserRewards', `${userId}_${challengeId}`);
                const userRewardSnap = await getDoc(userRewardRef);
                let userRewardData = userRewardSnap.exists() ? userRewardSnap.data() : null;

                let newProgress = userRewardData ? userRewardData.progress + 1 : 1;
                let status = newProgress >= challengeModel.targetQuantity ? 'completed' : 'in-progress';
                if (status === 'completed') newProgress = challengeModel.targetQuantity;

                await setDoc(userRewardRef, {
                    userId,
                    challengeId,
                    status,
                    progress: newProgress,
                    pointsAwarded: (newProgress / challengeModel.targetQuantity) * challengeModel.Point,
                    dateStarted: userRewardData ? userRewardData.dateStarted : new Date().toISOString(),
                    dateCompleted: status === 'completed' ? new Date().toISOString() : null,
                });

                onComplete();
            } catch (error) {
                console.error('Error updating user rewards:', error);
                setIsError(true);
            }
        }, 3000);
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
                <img src={imageSrc} alt="Captured" className="qr-image-preview" />
            )}

            {loading && (
                <div className="loading-popup">
                    <div className="loading-spinner"></div>
                </div>
            )}

            {showSuccess && (
                <div className="success-popup">
                    <p>Photo submitted successfully!</p>
                </div>
            )}

            {isError && (
                <div className="error-popup">
                    <p>Error uploading photo. Try again.</p>
                </div>
            )}
        </div>
    );
};

export default PhotoCapture;
