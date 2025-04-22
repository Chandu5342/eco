import React, { useState } from 'react';
import { db } from '../Configuration';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { bmvbhash } from 'blockhash-core';

const UploadVerifier = ({ challengeId, userId, binId }) => {
  const [image, setImage] = useState(null);
  const [hashes, setHashes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setErrorMessage('');

    try {
      const generatedHashes = await generateHashesWithRotations(file);
      setHashes(generatedHashes);
      console.log("Generated hashes:", generatedHashes);
    } catch (error) {
      console.error('Error generating perceptual hash:', error);
      setErrorMessage("Failed to process image.");
    }
  };

  const generateHashesWithRotations = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const rotations = [0, 90, 180, 270];
          const hashes = [];

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          for (let angle of rotations) {
            canvas.width = 256;
            canvas.height = 256;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(128, 128);
            ctx.rotate((angle * Math.PI) / 180);
            ctx.drawImage(img, -128, -128, 256, 256);
            ctx.restore();

            const imageData = ctx.getImageData(0, 0, 256, 256);
            const hash = bmvbhash(imageData, 32); // Higher detail
            hashes.push(hash);
          }

          resolve(hashes);
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const hammingDistance = (hash1, hash2) => {
    let dist = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) dist++;
    }
    return dist;
  };

  const handleUpload = async () => {
    if (!image || hashes.length === 0) {
      setErrorMessage("Please select an image first.");
      return;
    }

    setLoading(true);

    try {
      const q = query(
        collection(db, "imageUploads"),
        where("userId", "==", userId),
        where("challengeId", "==", challengeId),
        where("binId", "==", binId)
      );
      const snapshot = await getDocs(q);

      for (const doc of snapshot.docs) {
        const existingHashes = doc.data().perceptualHashes || [doc.data().perceptualHash];
        for (let existingHash of existingHashes) {
          for (let newHash of hashes) {
            const dist = hammingDistance(newHash, existingHash);
            console.log(`Comparing with existing hash: Distance = ${dist}`);
            if (dist <= 20) {
              setErrorMessage("Duplicate or visually similar image detected.");
              setLoading(false);
              return;
            }
          }
        }
      }

      await addDoc(collection(db, "imageUploads"), {
        perceptualHashes: hashes, // Store all 4 rotated hashes
        userId,
        challengeId,
        binId,
        timestamp: new Date()
      });

      alert("Image uploaded and hash stored successfully!");
      setImage(null);
      setHashes([]);
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMessage("Error storing the hash. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && <p>Image selected: {image.name}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Checking..." : "Upload Image"}
      </button>
    </div>
  );
};

export default UploadVerifier;
