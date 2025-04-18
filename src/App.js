import logo from './logo.svg';
import './App.css';
import React from 'react';
import Honey from './Honey';
import Landingpage from './dashboard/Landingpage';
import Challenges from './dashboard/Challenges';
import Rolemode from './Rolemodel/Rolemode';
import { ToastContainer } from 'react-toastify';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Sign from './dashboard/Sign';
import FristPage from './dashboard/FristPage';
import VerifyRecycling from './dashboard/Verification';
import VerificationP from './dashboard/VerificationP';
import QRScanner from './dashboard/Exam';
import PhotoCapture from './dashboard/PhotoCapture';
import Profile from './dashboard/Profile';


function App() { 
  return (
    <>
      <BrowserRouter>
         <Routes>
          <Route path="/" element={ <FristPage></FristPage>}></Route>
          <Route path='/dashboard/LandingPage' element={<Landingpage></Landingpage>}></Route>
          <Route path="/dashboard/Sign" element={<Sign />} />
          <Route path="/dashboard/web" element={<QRScanner />} />
          <Route path="/a" element={<PhotoCapture />} />
          <Route path="/dashboard/Verification/:challengeId/:userId" element={<VerificationP />} />

          <Route path="/dashboard/Challenges" element={<Challenges />} />
          <Route path="/Rolemodel/Rolemode" element={<Rolemode></Rolemode>} />
          <Route path="/dashboard/VerificationP" element={<VerificationP />} />
          <Route path="/dashboard/Profile" element={<Profile />} />
         </Routes>
         
      </BrowserRouter>
      <ToastContainer />
        </>
  );
}

export default App;
