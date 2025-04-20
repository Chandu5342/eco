import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { getPredictedLabel } from '../utils/ImageValidator'; // adjust path if needed

const classLabels = ['covers', 'Bottles', 'glass'];


const VerifyChallenge = () => {
  const imgRef = useRef(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);
  const [predictedLabel, setPredictedLabel] = useState('');

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();

        const loadedModel = await tf.loadLayersModel(
          'https://teachablemachine.withgoogle.com/models/oipoNJ3tQ/model.json'
        );

        setModel(loadedModel);
        setLoading(false);
        console.log('✅ Model loaded');
      } catch (error) {
        console.error('❌ Model load error:', error);
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPredictedLabel('');
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = async () => {
    try {
      const label = await getPredictedLabel(imgRef.current, model, classLabels);
      setPredictedLabel(label);
    } catch (err) {
      console.error('Prediction error:', err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>🧪 Challenge Verification</h2>

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {loading && <p>⏳ Loading model...</p>}

      {imageSrc && (
        <>
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Preview"
            crossOrigin="anonymous"
            onLoad={onImageLoad}
            style={{ width: '100%', marginTop: '10px', border: '1px solid gray' }}
          />
          {predictedLabel && (
            <p style={{ marginTop: '10px' }}>🔍 Predicted: <strong>{predictedLabel}</strong></p>
          )}
        </>
      )}
    </div>
  );
};

export default VerifyChallenge;
