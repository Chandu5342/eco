import React, { useState } from "react";


function Team() {
    const [showForm, setShowForm] = useState(false);

    const handleFormToggle = () => {
        setShowForm(!showForm);
    };

    return (
        <>
            {showForm && <div className="overlay" onClick={handleFormToggle}></div>}

            <div className="table-container">
                <div className="top-bar">
                    <button onClick={handleFormToggle} className="add-btn">➕ Add Team</button>
                    <h3 className="table-title">Team List</h3>
                    <div style={{ width: '130px' }}></div> {/* spacer to balance the button width */}
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Challenge Name</th>
                            <th>Challenge Type</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Recycle Plastic</td>
                            <td>Recycling</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Plant a Tree</td>
                            <td>Environment</td>
                            <td>100</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Donate Old Clothes</td>
                            <td>Social</td>
                            <td>75</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="popup-form">
                    <h3>Add New Team</h3>
                    <form>
                        <input type="text" placeholder="Challenge Name" required />
                        <input type="text" placeholder="Challenge Type" required />
                        <input type="number" placeholder="Points" required />
                        <div className="popup-buttons">
                            <button type="submit">Submit</button>
                            <button type="button" onClick={handleFormToggle}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default Team;
