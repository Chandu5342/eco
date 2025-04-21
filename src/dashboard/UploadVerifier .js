import React, { useState } from 'react';
import { db, storage } from '../Configuration'; // your config file path
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UploadVerifier = ({ challengeId, userId, binId }) => {

  return (
    <div>
      
    </div>
  );
};

export default UploadVerifier;
