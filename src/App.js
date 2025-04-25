import logo from './logo.svg';
import './App.css';

import Honey from './Honey';
import Landingpage from './dashboard/Landingpage';
import Challenges from './dashboard/Challenges';
import Rolemode from './Rolemodel/Rolemode';
import { ToastContainer } from 'react-toastify';
import { auth } from './Configuration';
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
import VerifyChallenge from './dashboard/VerifyChallenge';
import HIW from './dashboard/HIW';
import Rewards from './dashboard/Rewards';
import RewardJourney from './dashboard/RewardJourney ';

import React, { useEffect, useState } from 'react';
import Contact from './dashboard/Contact';
function App() { 
  let [user, setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);
  return (
    <>
      <BrowserRouter>
         <Routes>
          <Route path="/" element={ <FristPage></FristPage>}></Route>
          <Route path='/dashboard/LandingPage'   element={user?<RewardJourney/>:<Landingpage />} ></Route>
          <Route path="/dashboard/Sign" element={<Sign />} />
          <Route path="/dashboard/web" element={<QRScanner />} />
          <Route path="/dashboard/HIW" element={<HIW />} />
          <Route path="/dashboard/rewards" element={<Rewards />} />
          <Route path="/a" element={<VerifyChallenge />} />
          <Route path="/dashboard/Verification/:challengeId/:userId" element={<VerificationP />} />
          <Route path="/dashboard/contact" element={<Contact />} />

          {/* <Route path="/dashboard/Challenges" element={<Challenges />} /> */}
          <Route path="/Rolemodel/Rolemode" element={<Rolemode></Rolemode>} />
          <Route path="/dashboard/VerificationP" element={<VerificationP />} />
          <Route path="/dashboard/Profile" element={<Profile />} />
          <Route path="/dashboard/Challenges" element={<RewardJourney />} />
         </Routes>
         
      </BrowserRouter>
      <ToastContainer />
        </>
  );
}

export default App;
