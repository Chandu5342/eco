import React from "react";
import "./Contact.css"; // Make sure to import the CSS file

const teamMembers = [
 
];


function Contact() {
    return (
        <div className="contact-container">
       
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
