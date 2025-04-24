
import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { getPredictedLabel } from '../utils/ImageValidator';
import { updateDoc, doc, getDoc, setDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';
import { db } from '../Configuration';
import blockhash from 'blockhash-core';
import './PhotoCapture.css';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
const classLabels = ['Plastic Cover', 'Bottles', 'Glass', 'E-waste', 'Metals'];

const PhotoCapture = ({ challengeId, userId, onComplete }) => {
    const webcamRef = useRef(null);
    const imgRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [challengeModel, setChallengeModel] = useState(null);
    const [model, setModel] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [predictedLabel, setPredictedLabel] = useState('');
    const [expectedType, setExpectedType] = useState('');
    const [challengeItem, setChallengeItem] = useState('');

    useEffect(() => {
        const fetchChallengeDetails = async () => {
            try {
                const challengeRef = doc(db, 'Challenges', challengeId);
                const challengeSnap = await getDoc(challengeRef);
                if (challengeSnap.exists()) {
                    const data = challengeSnap.data();
                    setChallengeModel(data);
                    setChallengeItem(data.name);
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

    const getRotatedHashes = async (imgElement) => {
        const hashes = [];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 256;
        canvas.width = canvas.height = size;
        const angles = [0, 90, 180, 270];

        for (let angle of angles) {
            ctx.clearRect(0, 0, size, size);
            ctx.save();
            ctx.translate(size / 2, size / 2);
            ctx.rotate((angle * Math.PI) / 180);
            ctx.drawImage(imgElement, -size / 2, -size / 2, size, size);
            ctx.restore();

            const imageData = ctx.getImageData(0, 0, size, size);
            const hash = await blockhash.bmvbhash(imageData, 16);
            hashes.push(hash);
        }
        return hashes;
    };

    const hammingDistance = (hash1, hash2) => {
        let dist = 0;
        for (let i = 0; i < hash1.length; i++) {
            if (hash1[i] !== hash2[i]) dist++;
        }
        return dist;
    };

    const handleSubmit = async () => {
        if (!imageSrc || !challengeModel || !model) {
            alert('Please capture or upload an image first, or model/challenge data is missing.');
            return;
        }

        setLoading(true);
        setShowSuccess(false);
        setIsError(false);

        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
            const label = await getPredictedLabel(imgRef.current, model, classLabels);
            setPredictedLabel(label);

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

            if (label.trim().toLowerCase() !== expectedTypeData.trim().toLowerCase()) {
                setIsError(true);
                setErrorMessage(`Invalid item! Expected: ${expectedTypeData}, but got: ${label}`);

                setLoading(false);
                return;
            }

            const newHashes = await getRotatedHashes(imgRef.current);

            const hashesQuery = query(
                collection(db, 'ImageHashes'),
                where('userId', '==', userId),
                where('challengeId', '==', challengeId)
            );

            const existingSnapshots = await getDocs(hashesQuery);
            let isDuplicate = false;

            existingSnapshots.forEach(doc => {
                const oldHashes = doc.data().hashes || [];
                newHashes.forEach(newHash => {
                    oldHashes.forEach(oldHash => {
                        const dist = hammingDistance(newHash, oldHash);
                        if (dist <= 20) {
                            isDuplicate = true;
                        }
                    });
                });
            });

            if (isDuplicate) {
                setIsError(true);
                setErrorMessage("🚫 Duplicate image detected! Try a different photo.");

                setLoading(false);
                return;
            }

            await addDoc(collection(db, 'ImageHashes'), {
                userId,
                challengeId,
                hashes: newHashes,
                timestamp: new Date().toISOString(),
            });

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
                pointsAwarded: newProgress >=parseInt(challengeModel.targetQuantity) ? parseInt(challengeModel.points) : 0,
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
    const celebrate = () => {
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };
    
        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
    
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
    
            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: {
                    x: Math.random(),
                    y: Math.random() - 0.2
                }
            }));
        }, 250);
    };
    
    useEffect(() => {
        if (showSuccess) celebrate();
    }, [showSuccess]);
    
    const closePopup = () => {
        setShowSuccess(false);
        setIsError(false);
        setPredictedLabel('');
        setImageSrc(null);
        setIsCameraOpen(false);
    };

    return (
        <div className="photo-capture-container">
             <button className='upload-btn' onClick={() => setIsCameraOpen(true)}>Upload Image</button>
            {/* <div className="qr-button" onClick={() => setIsCameraOpen(true)}></div> */}
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
                        <label className="uploads-btn">
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
                        ref={imgRef}
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
                    <a  href='/dashboard/Challenges' className="home-btn">More Challenges</a>
                    <button onClick={closePopup} className="cancel-btn">Cancel</button>
                </div>
            )}

            {isError && (
                <div className="error-popup" style={{ width: '320px', height: 'auto' }}>
                    <p style={{ fontWeight: 'bold', color: '#dc3545', fontSize: '16px' }}>
                        ❌ {errorMessage}
                    </p>
                    {(expectedType && predictedLabel && errorMessage.includes("Expected")) && (
                        <p>
                            Expected: <strong>{expectedType}</strong>, but got: <strong>{predictedLabel}</strong>
                        </p>
                    )}
                    <div style={{ marginTop: '12px' }}>
                           <a  href='/dashboard/Challenges' className="home-btn">More Challenges</a>
                        <button onClick={closePopup} className="try-again-btn">Try Again</button>
                        <button onClick={closePopup} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PhotoCapture;
