import React from 'react'
import "./Apbar.css";

function Apbar() {
    return (
        <div className="appbar-container">
            <div className="appbar-left">
                <h2 className='logo'>Weather Now</h2> 
            </div>
            <div className="appbar-right">
                <button className="appbar-button">Join Us</button>
            </div>
        </div>
    )
}

export default Apbar
