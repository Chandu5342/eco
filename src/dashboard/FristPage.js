import "./FristPage.css"
import Drink from "../images/drink-removebg-preview (1).png"
import Scan from "../images/scnner.png"
import Photo from "../images/photo.png"
import Throw from "../images/throw.png"
import Hurray from "../images/hurray.png"
import Footer from "./Footer"
import Walk from "../images/walk2.gif"

function FristPage() {
   return(
    <>
        <nav className="navbar">
        <div className="logo">Ecoryclr</div>
        <ul className="nav-links">
            <li><a href="#about">About Ecoryclr</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#leaderboards">Leaderboards</a></li>
            <li><a href="#support">Support</a></li>
        </ul>
        <a href="dashboard/LandingPage"><button className="join-btn">Join Now</button></a>
    </nav>
    
    <header className="hero">
        
        <div className="hero-images overlay">
            <div className="hero-item">
                <img src={Drink} alt="Drink" className="hero-img" />
                <span className="arrow">→</span>
            </div>
            <div className="hero-item">
                <img src={Scan} alt="Scan" className="hero-img" />
                <span className="arrow">→</span>
            </div>
            <div className="hero-item">
                <img src={Photo} alt="Photo" className="hero-img" />
                <span className="arrow">→</span>
            </div>
            <div className="hero-item">
                <img src={Throw} alt="Throw" className="hero-img" />
                <span className="arrow">→</span>
            </div>
            <div className="hero-item">
                <img src={Hurray} alt="Throw" className="hero-img" />
            </div>
        </div>
    </header>
    
    <section class="section3">
        <div className="sec">
        <div>
        <h2>Elevate your recycling game with EcoRecyclr! Our platform transforms recycling into an engaging adventure...
        </h2>
        <ul class="features-list">
            <li><img src="https://foodrevolution.org/wp-content/uploads/iStock-1205802516.jpg" alt="Challenge Icon" /> <strong>Customized Recycling Challenges:</strong> Dive into
                exciting tasks like recycling five plastic bottles, and track your progress effortlessly through our
                intuitive user dashboard.</li>
            <li><img src="https://tse3.mm.bing.net/th?id=OIP.rQT1yQ3QgrwFb114brZ92gHaEf&pid=Api&P=0&h=180" alt="QR Code Icon" /> <strong>QR Code Scanning & GPS Verification:</strong> Use your
                mobile device to scan QR codes at recycling bins, ensuring your actions are recognized and verified with
                GPS technology.</li>
            <li><img src="https://tse4.mm.bing.net/th?id=OIP.-zqoV3DiFnyJg0dX99mVfAHaHa&pid=Api&P=0&h=180" alt="Rewards Icon" /> <strong>Eco Points & Rewards:</strong> Earn Eco Points for
                completing challenges and redeem them for amazing rewards, including eco-friendly products and exclusive
                discounts.</li>
        </ul>
        </div>
        <div class="image-container-section3">
            <img src="https://imagedelivery.net/xaKlCos5cTg_1RWzIu_h-A/f41878a9-a3de-4eaf-2b59-4810c5bd4500/public" alt="Recycling Adventure" />
        </div>
        </div>
    </section>
        <section class="section4">
            <div className="sec">
            <div><h1>Transform your recycling experience with EcoRecyclr...</h1>
                <p className="par">"EcoRecyclr enabled me to view recycling as a fun challenge. The gamification aspect motivated me to
                    contribute more to sustainability!"</p>
            </div>
            <div class="testimonial">
                <img src="https://imagedelivery.net/xaKlCos5cTg_1RWzIu_h-A/0fc42a71-98f8-420e-9dc5-8b8b8d2ea800/public" alt="EcoRecyclr Experience" class="testimonial-image" />
            </div>
            </div>
        </section>
        <section className="section5">  
        <div className="sec">
        <div className="sect">
        <h2 >
            Elevate Your Recycling Journey with EcoRecyclr
        </h2>
        <div className="secm" >
            <form className="forms">
            <label for="email"  className="labem" >Your Email</label>
                <input type="email" id="email" name="email" 
                    
                    required />
    
                <label for="contact"  className="labem" >Contact Number</label>
                <input type="text" id="contact" name="contact"
                   
                    required />
    
                <label for="message" className="labem" >Your Message</label>
                <textarea id="message" name="message" rows="4"
                    
                    required></textarea>
    
                <button type="submit" className="subbut"
                  >
                    SUBMIT INQUIRY
                </button>
            </form>
        </div>
    </div>
    <div><img src="https://landingsite-static-web-images.s3.us-east-2.amazonaws.com/man_gardener.png" alt="Recycling Image 1"   style={{height: 510}}/></div>
</div>
    </section>
    <footer>
        <p>&copy; 2025 EcoRecyclr. All rights reserved.</p>
        <p>Follow us on:
            <a href="#" >Facebook</a> |
            <a href="#" >Twitter</a> |
            <a href="#" >Instagram</a>
        </p>
    </footer>


    </>
   )
}
export default FristPage;
