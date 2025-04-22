import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs,deleteDoc,doc, query } from "firebase/firestore";
import { auth, db } from "../Configuration";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";

function Dustbin() {
  const [showForm, setShowForm] = useState(false);
  const [DustbinList, setDustbinList] = useState([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState("");
  const [UserId, setUserId] = useState("0");
  const [pdfPreview, setPdfPreview] = useState("");
  const [showPdfPreview, setShowPdfPreview] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
        const [showdelete, Setshowdelete] = useState(false);
  const [DustbinModel, setDustbinModel] = useState({
    Id: "0",
    DustbinName: "",
    Latitude: "",
    Longitude: "",
    Address: "",
    Createdby: "",
  });

  const dbDustbin = collection(db, "Dustbins");

  const handleFormToggle = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const modelToSave = {
        ...DustbinModel,
        CreatedBy: UserId,
        Latitude: parseFloat(DustbinModel.Latitude),
        Longitude: parseFloat(DustbinModel.Longitude),
      };
      await addDoc(dbDustbin, { DustbinModel: modelToSave });
      toast.success("Created Successfully", { position: "top-center" });
      await LoadDustbinList();
    } catch (e) {
      toast.error(e.message, { position: "top-center" });
    }
    setShowForm(false);
  };
  
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user != null) {
        setUserId(user.uid);
      }
    });
  };

  const LoadDustbinList = async () => {
    const res = await getDocs(query(dbDustbin));
    const DList = res.docs
      .map((doc) => {
        const data = doc.data();
        const model = data.DustbinModel;
  
        if (!model) return null; // skip if model is undefined
  
        return {
          DustbinName: model.DustbinName,
          Latitude: model.Latitude,
          Longitude: model.Longitude,
          Address: model.Address,
          Id: doc.id,
          QRCode: `https://api.qrserver.com/v1/create-qr-code/?data=${doc.id}&size=100x100`,
        };
      })
      .filter((item) => item !== null); // remove any null entries
  
    setDustbinList(DList);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setDustbinModel((prev) => ({
            ...prev,
            Latitude: lat,
            Longitude: lon,
          }));
        },
        () => {
          toast.error("Failed to fetch location", { position: "top-center" });
        }
      );
    } else {
      toast.error("Geolocation not supported", { position: "top-center" });
    }
  };
  

  const handleQRCodeToggle = (qrCode) => {
    setSelectedQRCode(qrCode);
    setShowQRCode(true);
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
  };

  const handleDownloadQR = () => {
    const qrCodeDataUrl = document.querySelector(".qrcode-image").toDataURL();
    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = `dustbin_${selectedQRCode}.png`;
    link.click();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;

    DustbinList.forEach((item) => {
      doc.text(`Dustbin Name: ${item.DustbinName}`, 10, yOffset);
      doc.text(`Latitude: ${item.Latitude}`, 10, yOffset + 10);
      doc.text(`Longitude: ${item.Longitude}`, 10, yOffset + 20);
      doc.text(`Address: ${item.Address}`, 10, yOffset + 30);
      doc.text(`QR Code:`, 10, yOffset + 40);
      doc.addImage(item.QRCode, "JPEG", 10, yOffset + 50, 40, 40);

      yOffset += 100;
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 10;
      }
    });

    const dataUri = doc.output("datauristring");
    setPdfPreview(dataUri);
    setShowPdfPreview(true);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;

    DustbinList.forEach((item) => {
      doc.text(`Dustbin Name: ${item.DustbinName}`, 10, yOffset);
      doc.text(`Latitude: ${item.Latitude}`, 10, yOffset + 10);
      doc.text(`Longitude: ${item.Longitude}`, 10, yOffset + 20);
      doc.text(`Address: ${item.Address}`, 10, yOffset + 30);
      doc.text(`QR Code:`, 10, yOffset + 40);
      doc.addImage(item.QRCode, "JPEG", 10, yOffset + 50, 40, 40);

      yOffset += 100;
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 10;
      }
    });

    doc.save("All_Dustbin_QR_Codes.pdf");
  };
  const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "Dustbins", deleteId));
            Setshowdelete(false);
            toast.success("Deleted Successfully", { position: "top-center" });
            LoadDustbinList();
        } catch (error) {
            console.log(error);
        }
    };
  useEffect(() => {
    fetchUserData();
    LoadDustbinList();
  }, []);

  return (
    <>
      {showForm && <div className="ssss" onClick={handleFormToggle}></div>}

      <div className="table-container">
        <div className="top-bar">
          <button onClick={handleFormToggle} className="add-btn">
            ➕ Add Dustbin
          </button>
          <h3 className="table-title">Dustbin List</h3>
          <div style={{ width: "150px", textAlign: "right" }}>
            <button onClick={generatePDF} className="pdf-btn">📄 Generate PDF</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Dustbin Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Address</th>
              <th>QR Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {DustbinList.map((item, index) => (
              <tr key={item.Id}>
                <td>{index + 1}</td>
                <td>{item.DustbinName}</td>
                <td>{item.Latitude}</td>
                <td>{item.Longitude}</td>
                <td>{item.Address}</td>
                <td>
                  <button onClick={() => handleQRCodeToggle(item.QRCode)}>
                    <i className="eye-icon">👁️</i>
                  </button>
                </td>
                <td>
                                <i className="fa-solid fa-trash" style={{ cursor: "pointer", color: "red", marginLeft: "10px" }} onClick={() => { setDeleteId(item.Id); Setshowdelete(true); }}></i>
                               </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QR Code Popup */}
      {showQRCode && (
        <div className="popup-form">
          <div className="popup-content">
            <h3>Dustbin QR Code</h3>
            <QRCodeCanvas value={selectedQRCode} size={256} className="qrcode-image" />
            <div className="popup-buttons">
              <button onClick={handleCloseQRCode}>Close</button>
              <button onClick={handleDownloadQR}>Download QR</button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Popup */}
      {showPdfPreview && (
        <div className="popup-form">
          <div className="popup-content" style={{ maxWidth: "90%", height: "80vh" }}>
            <h3>Dustbin QR Code PDF Preview</h3>
            <iframe
              src={pdfPreview}
              title="PDF Preview"
              width="100%"
              height="100%"
              style={{ border: "1px solid #ccc", borderRadius: "8px" }}
            ></iframe>
            <div className="popup-buttons" style={{ marginTop: "10px" }}>
              <button onClick={handleDownloadPDF}>Download PDF</button>
              <button onClick={() => setShowPdfPreview(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Dustbin Form */}
      {showForm && (
        <div className="popup-form">
          <h3>Add New Dustbin</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Dustbin Name"
              required
              value={DustbinModel.DustbinName}
              onChange={(e) => setDustbinModel({ ...DustbinModel, DustbinName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Latitude"
              required
              value={DustbinModel.Latitude}
              onChange={(e) => setDustbinModel({ ...DustbinModel, Latitude: e.target.value })}
            />
            <input
              type="text"
              placeholder="Longitude"
              required
              value={DustbinModel.Longitude}
              onChange={(e) => setDustbinModel({ ...DustbinModel, Longitude: e.target.value })}
            />
            <button type="button" onClick={getCurrentLocation}>
              Use My Location
            </button>
            <input
              type="text"
              placeholder="Address"
              required
              value={DustbinModel.Address}
              onChange={(e) => setDustbinModel({ ...DustbinModel, Address: e.target.value })}
            />
            <div className="popup-buttons">
              <button type="submit">Submit</button>
              <button type="button" onClick={handleFormToggle}>Cancel</button>
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

export default Dustbin;