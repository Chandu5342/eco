import React from "react";
import "./Contact.css"; // Make sure to import the CSS file

const teamMembers = [
    {
        name: "M.Sudheeshna",
        roll: "23L31A05F9",
        email: "alice@example.com",
        phone: "8919366234",
        linkedin: "https://www.linkedin.com/in/alicesharma"
    },
    {
        name: "Rahul Mehta",
        roll: "23L31A05F9",
        email: "rahul@example.com",
        phone: "9876543211",
        linkedin: "https://www.linkedin.com/in/rahulmehta"
    },
    {
        name: "Neha Gupta",
        roll: "23L31A05F9",
        email: "neha@example.com",
        phone: "9876543212",
        linkedin: "https://www.linkedin.com/in/nehagupta"
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
