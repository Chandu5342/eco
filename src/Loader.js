import React from "react"
import './Loader.css'
function Loader()
{
    return(
<>
                         <div className="overlay-popup">
                                <div className="loader-circle"></div>
                                <p>Loading...</p>
                            </div>
</>
    )
}
export default Loader