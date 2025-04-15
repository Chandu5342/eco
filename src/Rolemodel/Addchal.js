import React, { useState,useEffect } from "react";
import { addDoc, collection, getDocs, query,deleteDoc, doc, updateDoc ,getDoc,setDoc} from "firebase/firestore";
import { auth ,db} from "../Configuration";
import  {toast} from "react-toastify"; 

function Addchal() {
    const [showForm, setShowForm] = useState(false);
   
    const [ChallengeList, setChallengeList] = useState([]); 
    let [UserId,setUserId]=useState("0")
    const handleFormToggle = () => {
        setShowForm(!showForm);
    };
    

    let [ChallengeModel,setChallengeModel]=useState(
    {
        Id:"0",
        ChallengeName:"",
        Type:"",
        Point:0,
        Createdby:""
    }
    )
    const dbChallenge = collection(db, 'Challenges');
    const handleSubmit=async ()=>{
        try {
            console.log(UserId);
            setChallengeModel({...ChallengeModel,CreatedBy:UserId})
             const docRef = await addDoc(dbChallenge, {ChallengeModel});
             console.log("Created Successfully");
             toast.success("Created Successfully",{position:'top-center'})
             await LoadChallengesList();
           
        } catch (e) {
            console.error('Error adding document:', e);
            toast.error(e,{position:'top-center'})
        }
        setShowForm(false);
    }

    const fetchUserData = async()=>{
        
        auth.onAuthStateChanged(async(user)=>{
            console.log(user);
            if(user!=null)
            {
            setUserId(user.uid);
            console.log("userid exist");
            }
        });
    };

    const LoadChallengesList=async ()=>{
        const res=await getDocs(query(dbChallenge))
        const CList = res.docs.map(doc => ({
            ChallengeName:doc.data().ChallengeModel.ChallengeName,
            Type:doc.data().ChallengeModel.Type,
            Point:doc.data().ChallengeModel.Point,
            Id:doc.id
        }));
        setChallengeList(CList);
        
    }
    useEffect(()=>{
        fetchUserData();
        LoadChallengesList();
    },[])
    return (
        <>
            {showForm && <div className="ssss" onClick={handleFormToggle}></div>}

            <div className="table-container">
                <div className="top-bar">
                    <button onClick={handleFormToggle} className="add-btn">➕ Add Challenge</button>
                    <h3 className="table-title">Challenge List</h3>
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
                        
                        {ChallengeList.map((item, index) => (
                            <tr key={item.Id}>
                                <td>{index + 1}</td>
                                <td>{item.ChallengeName}</td>
                                <td>{item.Type}</td>
                                <td>{item.Point}</td>
                               
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="popup-form">
                    <h3>Add New Challenge</h3>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Challenge Name" required  value={ChallengeModel.ChallengeName} 
                         onChange={(e)=>{setChallengeModel({...ChallengeModel,ChallengeName:e.target.value})}} />
                        <input type="text" placeholder="Challenge Type" required  value={ChallengeModel.Type} 
                         onChange={(e)=>{setChallengeModel({...ChallengeModel,Type:e.target.value})}}/>
                        <input type="number" placeholder="Points" required   value={ChallengeModel.Point} 
                         onChange={(e)=>{setChallengeModel({...ChallengeModel,Point:e.target.value})}} />
                        <div className="popup-buttons">
                            <button>Submit</button>
                            <button type="button" onClick={handleFormToggle}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default Addchal;
