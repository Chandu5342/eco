import React, { useState } from "react";
import "./Rolemode.css";
import Addchal from "./Addchal";
import Dustbin from "./Dustbin";
import Team from "./Team";
import Navbar from "../dashboard/Navbar";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";

function Rolemode() {
    const [Page, SetPage] = useState("");

    const menuItems = [
        { key: "C", label: "New Challenge", icon: <FaTasks /> },
        { key: "D", label: "New Dustbin", icon: <FaTrashAlt /> },
        { key: "T", label: "Team Member", icon: <FaUsers /> },
    ];

    return (
        <div className="rolecontent">
            <Navbar />
            <div className="role-mode-layout">
                <aside className="sidebar">
                    <ul>
                        {menuItems.map(({ key, label, icon }) => (
                            <li key={key}>
                                <button
                                    className={`sidebar-link ${Page === key ? "active" : ""}`}
                                    onClick={() => SetPage(key)}
                                >
                                    {icon}
                                    <span>{label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="main-content">
                    {Page === "C" && <Addchal />}
                    {Page === "D" && <Dustbin />}
                    {Page === "T" && <Team />}
                    {!Page && (
                        <div className="welcome-message">
                            <h2>Welcome!</h2>
                            <p>Select a role option from the sidebar.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Rolemode;
