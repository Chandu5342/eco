import React from "react";
import "./Rolemode.css"
import { useState } from "react";
import Addchal from "./Addchal";
import Dustbin from "./Dustbin";
import Team from "./Team";
import Navbar from "../dashboard/Navbar";
function Rolemode() {
    let [Page, SetPage] = useState("");

    return (

        <>
        <div className="rolecontent">
                <Navbar></Navbar>
                <div class="role-mode-layout">

                    <aside class="sidebar">
                        <ul>
                            <li><a href="#" onClick={() => { SetPage("C") }}>New Challenge</a></li>
                            <li><a href="#" onClick={() => { SetPage("D") }}>New Dustbin</a></li>
                            <li><a href="#" onClick={() => { SetPage("T") }}>Team Member</a></li>
                        </ul>
                    </aside>
                    {Page == "C" && (
                        <Addchal></Addchal>
                    )}
                    {Page == "D" && (
                        <Dustbin></Dustbin>
                    )}
                    {Page == "T" && (
                       <Team></Team>
                    )}


                </div>
            </div>

        </>
    );
}
export default Rolemode