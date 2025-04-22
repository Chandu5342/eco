import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs,deleteDoc,doc, query } from "firebase/firestore";
import { auth, db } from "../Configuration";
import { toast } from "react-toastify";
import './Addchal.css';

function Addchal() {
    const [showForm, setShowForm] = useState(false);
    const [ChallengeList, setChallengeList] = useState([]);
    const [UserId, setUserId] = useState("0");
    const [showChallengeTypePopup, setShowChallengeTypePopup] = useState(false);
    const [ChallengeTypes, setChallengeTypes] = useState([]);
    const [ChallengeTypeMap, setChallengeTypeMap] = useState({});
    const [ChallengeModel, setChallengeModel] = useState({
        Id: "0",
        ChallengeName: "",
        TypeId: "", // Store the ChallengeTypeId here
        Point: 0,
        CreatedBy: "",
        Description: "",
        TargetQuantity: 0,
    });
    const [showdelete, Setshowdelete] = useState(false);
    const dbChallenge = collection(db, "Challenges");
    const dbChallengeType = collection(db, "ChallengeType");
    const [deleteId, setDeleteId] = useState(null);
    const handleFormToggle = () => {
        setShowForm(!showForm);
    };

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user != null) {
                setUserId(user.uid);
                console.log("User ID exists");
            }
        });
    };

    const LoadChallengesList = async () => {
        const res = await getDocs(query(dbChallenge));
        const challtypedata = {};
        const CList = res.docs.map((doc) => {
            const typeId = doc.data().type; // Get the ChallengeTypeId from the challenge document
            challtypedata[doc.id] = typeId; // Map challenge ID to type ID
            return {
                Id: doc.id,
                Description: doc.data().description,
                TargetQuantity: doc.data().targetQuantity,
                Point: doc.data().points,
                TypeId: typeId, // Store typeId
                ChallengeName: doc.data().name,
            };
        });
        setChallengeList(CList);
        setChallengeTypeMap(challtypedata); // Store map of challenge IDs to type IDs
    };

    const fetchChallengeTypes = async () => {
        const res = await getDocs(query(dbChallengeType));
        const typesList = res.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().ChallengeTypeModel.ChallengeTypeName,
        }));
        setChallengeTypes(typesList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setChallengeModel({ ...ChallengeModel, CreatedBy: UserId });
            await addDoc(dbChallenge, {
                name: ChallengeModel.ChallengeName,
                type: ChallengeModel.TypeId, // Store the ChallengeTypeId here
                points: ChallengeModel.Point,
                description: ChallengeModel.Description,
                targetQuantity: ChallengeModel.TargetQuantity,
                createdBy: UserId,
                createdAt: new Date(),
                active: true,
            });
            console.log("Created Successfully");
            toast.success("Challenge Created Successfully", { position: "top-center" });
            await LoadChallengesList();
        } catch (e) {
            console.error("Error adding document:", e);
            toast.error(e.message, { position: "top-center" });
        }
        setShowForm(false);
    };

    const handleAddChallengeType = async (e) => {
        e.preventDefault();
        const challengeTypeName = e.target.challengeTypeName.value;
        try {
            const newChallengeTypeRef = await addDoc(dbChallengeType, {
                ChallengeTypeModel: {
                    ChallengeTypeName: challengeTypeName,
                },
            });
            toast.success("Challenge Type Created Successfully", { position: "top-center" });
            fetchChallengeTypes(); // Refresh challenge types list
            setShowChallengeTypePopup(false);
        } catch (error) {
            toast.error("Failed to create challenge type: " + error.message, { position: "top-center" });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "Challenges", deleteId));
            Setshowdelete(false);
            toast.success("Deleted Successfully", { position: "top-center" });
            LoadChallengesList();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUserData();
        LoadChallengesList();
        fetchChallengeTypes();
    }, []);
    useEffect(() => {
        if (showForm || showChallengeTypePopup) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
    }, [showForm, showChallengeTypePopup]);

    return (
        <>
            {showForm && <div className="ssss" onClick={handleFormToggle}></div>}

            <div className="table-container">
                <div className="top-bar">
                    <button onClick={handleFormToggle} className="add-btn">
                        ➕ Add Challenge
                    </button>
                    <h3 className="table-title">Challenge List</h3>
                    <div style={{ width: "130px" }}></div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Challenge Name</th>
                            <th>Challenge Type</th>
                            <th>Points</th>
                            <th>Target Quantity</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ChallengeList.map((item, index) => (
                            <tr key={item.Id}>
                                <td>{index + 1}</td>
                                <td>{item.ChallengeName}</td>
                                <td>
                                    {
                                        // Use the ChallengeTypeMap to map the TypeId to its name
                                        ChallengeTypes.find(
                                            (type) => type.id === item.TypeId
                                        )?.name || "N/A"
                                    }
                                </td>
                                <td>{item.Point}</td>
                                <td>{item.TargetQuantity}</td>
                                <td>{item.Description}</td>
                                <td>
                                <i className="fa-solid fa-trash" style={{ cursor: "pointer", color: "red", marginLeft: "10px" }} onClick={() => { setDeleteId(item.Id); Setshowdelete(true); }}></i>
                               </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="popup-form">
                    <img src="/path-to-your-mascot-image.png" alt="Plant Mascot" className="plant-mascot" />
                    <h3>Add New Recycling Challenge</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Challenge Name"
                            required
                            value={ChallengeModel.ChallengeName}
                            onChange={(e) =>
                                setChallengeModel({
                                    ...ChallengeModel,
                                    ChallengeName: e.target.value,
                                })
                            }
                        />
                        <textarea
                            placeholder="Description"
                            required
                            value={ChallengeModel.Description}
                            onChange={(e) =>
                                setChallengeModel({
                                    ...ChallengeModel,
                                    Description: e.target.value,
                                })
                            }
                        />
                        <select
                            required
                            value={ChallengeModel.TypeId}
                            onChange={(e) =>
                                setChallengeModel({ ...ChallengeModel, TypeId: e.target.value })
                            }
                        >
                            <option value="">Select category</option>
                            {ChallengeTypes.map((type, index) => (
                                <option key={index} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Reward Points"
                            required
                            value={ChallengeModel.Point}
                            onChange={(e) =>
                                setChallengeModel({ ...ChallengeModel, Point: e.target.value })
                            }
                        />
                        <input
                            type="number"
                            placeholder="Target Quantity (e.g., 5)"
                            required
                            value={ChallengeModel.TargetQuantity}
                            onChange={(e) =>
                                setChallengeModel({ ...ChallengeModel, TargetQuantity: e.target.value })
                            }
                        />
                        <div className="popup-buttons">
                            <button type="submit">Add Challenge</button>
                            <button type="button" onClick={handleFormToggle}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}


            {/* Challenge Type Popup */}
            {showChallengeTypePopup && (
                <div className="popup-form">
                    <h3>Add New Challenge Type</h3>
                    <form onSubmit={handleAddChallengeType}>
                        <input
                            type="text"
                            name="challengeTypeName"
                            placeholder="Enter Challenge Type Name"
                            required
                        />
                        <div className="popup-buttons">
                            <button type="submit">Add</button>
                            <button
                                type="button"
                                onClick={() => setShowChallengeTypePopup(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}


            {showdelete && (
                <div className="popup-overlay">
                    <div className="popup-form">
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete this problem?</p>
                        <div className="popup-buttons">
                            <button className="delete-btn" onClick={handleDelete}>Delete</button>
                            <button className="cancel-btn" onClick={() => Setshowdelete(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Addchal;
