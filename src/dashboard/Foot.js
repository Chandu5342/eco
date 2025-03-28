import './FristPage.css'
function Foot()
{
  return(
    <>
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
export default Foot