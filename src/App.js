import logo from './logo.svg';
import './App.css';
import React from 'react';
import Honey from './Honey';
import Landingpage from './dashboard/Landingpage';
import Challenges from './dashboard/Challenges';
import Rolemode from './Rolemodel/Rolemode';


import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Sign from './dashboard/Sign';
import FristPage from './dashboard/FristPage';


function App() { 
  return (
    <>
      <BrowserRouter>
         <Routes>
          <Route path="/" element={ <FristPage></FristPage>}></Route>
          <Route path='/dashboard/LandingPage' element={<Landingpage></Landingpage>}></Route>
         <Route path="/dashboard/Sign" element={<Sign />} />
          <Route path="/dashboard/Challenges" element={<Challenges />} />
          <Route path="/Rolemodel/Rolemode" element={<Rolemode></Rolemode>} />

         </Routes>
         
      </BrowserRouter>
       
        </>
  );
}

export default App;
