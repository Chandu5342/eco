import React from "react";
import "./Contact.css"; // Make sure to import the CSS file

const teamMembers = [
  {
    name: "Kuriti Mahita",
    roll: "23L31A05EE3",
    email: "mahita.kuriti@gmail.com",
    phone: "9014957124",
    linkedin: "https://www.linkedin.com/in/mahita-kuriti-6084012b7"
  },
  {
    name: "Machineni Krishna Chaitanya",
    roll: "23L31A05E9",
    email: "mkrishnac931@gmail.com",
    phone: "9100363368",
    linkedin: "https://www.linkedin.com/in/m-krishna-chaitanya-b19441332"
  },
  {
    name: "Mamidi Kusuma Priya",
    roll: "23L31A05F5",
    email: "mamidikusumapriya@gmail.com",
    phone: "6301359971",
    linkedin: "https://www.linkedin.com/in/mamidi-kusuma-priya-039429358"
  },
  {
    name: "Marthi Sharmila",
    roll: "23L31A05F7",
    email: "marthisharmila555@gmail.com",
    phone: "8008451943",
    linkedin: "https://www.linkedin.com/in/sharmila-marthi-09507b35a"
  },
  {
    name: "Matta Sudheeshna",
    roll: "23L31A05F9",
    email: "sudheehoney2806@gmail.com",
    phone: "8919366234",
    linkedin: "https://www.linkedin.com/in/sudheeshna-matta-3a60a3296"
  },
  {
    name: "N.Sowjanya",
    roll: "23L31A05H1",
    email: "sowjanyanagisetti171@gmail.com",
    phone: "6301330793",
    linkedin: "https://www.linkedin.com/in/nagisetti-sowjanya-b3b314352"
  }
];


function Contact() {
    return (
        <div className="contact-container">
            <h1 className="heading">Our Team</h1>
            <div className="team-cards">
                {teamMembers.map((member, index) => (
                    <div key={index} className="card">
                        <h2>{member.name}</h2>
                        <p className="roll">{member.roll}</p>
                        <p>{member.email}</p>
                        <p>{member.phone}</p>
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                            LinkedIn Profile
                        </a>
                    </div>
                ))}
            </div>

            <h2 className="heading">Contact Us</h2>
            <p className="subheading">If you have any questions or feedback, feel free to reach out!</p>
            <form className="contact-form">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="message">Message:</label>
                <textarea id="message" name="message" required></textarea>

                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Contact;
