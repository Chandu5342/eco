import React, { useEffect, useState } from "react";
import { db } from '../Configuration';
import { toast } from "react-toastify";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where
} from 'firebase/firestore';
import './Team.css';

function Team() {
    const [showForm, setShowForm] = useState(false);
    const [teamUsers, setTeamUsers] = useState([]);
    const [nonTeamUsers, setNonTeamUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchTeamUsers = async () => {
        const usersRef = collection(db, "User");
        const q = query(usersRef, where("Role", "==", "yes"));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeamUsers(users);
    };

    const fetchNonTeamUsers = async () => {
        const usersRef = collection(db, "User");
        const q = query(usersRef, where("Role", "==", "no"));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNonTeamUsers(users);
    };

    const handleFormToggle = () => {
        const toggle = !showForm;
        setShowForm(toggle);
        setSearchTerm('');
        setSelectedUser(null);
        if (!showForm) fetchNonTeamUsers();
    };

    const handleRoleRemove = async (userId) => {
        const userRef = doc(db, "User", userId);
        await updateDoc(userRef, { Role: "no" });
         toast.success("Removed Successfully", { position: "top-center" });
        fetchTeamUsers();
        fetchNonTeamUsers();
    };

    const handleAssignRole = async () => {
        if (selectedUser) {
            const userRef = doc(db, "User", selectedUser.id);
            await updateDoc(userRef, { Role: "yes" });
            fetchTeamUsers();
            fetchNonTeamUsers();
            setSelectedUser(null);
            setSearchTerm('');
            setShowForm(false);
            toast.success("Successfully", { position: "top-center" });
        }
    };

    const handleSelectUser = async (id) => {
        const userRef = doc(db, "User", id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            setSelectedUser({ id: userSnap.id, ...userSnap.data() });
        }
    };

    const filteredNonTeamUsers = nonTeamUsers.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

    useEffect(() => {
        fetchTeamUsers();
    }, []);

    return (
        <>
            {showForm && <div className="overlay" onClick={handleFormToggle}></div>}

            <div className="table-container">
                <div className="top-bar">
                    <button onClick={handleFormToggle} className="add-btn">➕ Add Team</button>
                    <h3 className="table-title">Team List</h3>
                    <div style={{ width: '130px' }}></div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Points</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.Points}</td>
                                <td>
                                    <button onClick={() => handleRoleRemove(user.id)}>
                                        ❌ Remove Role
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="popup-form">
                    <h3>Assign Role to User</h3>
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSelectedUser(null); // Reset selected user when typing
                        }}
                    />

                    <select
                        value={selectedUser ? selectedUser.id : ''}
                        onChange={(e) => handleSelectUser(e.target.value)}
                    >
                        <option value="">Select a user</option>
                        {filteredNonTeamUsers.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.email}
                            </option>
                        ))}
                    </select>

                    {selectedUser && (
                        <div className="user-profile">
                            <p><strong>Name:</strong> {selectedUser.username}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Phone:</strong> {selectedUser.Phno}</p>
                            <p><strong>Address:</strong> {selectedUser.Address}</p>
                            <p><strong>Points:</strong> {selectedUser.Points}</p>
                        </div>
                    )}

                    <div className="popup-buttons">
                        <button onClick={handleAssignRole}>Get Role</button>
                        <button onClick={handleFormToggle}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Team;
