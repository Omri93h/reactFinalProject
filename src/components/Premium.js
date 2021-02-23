import React from 'react'
import Button from '@material-ui/core/Button';
import StarIcon from '@material-ui/icons/Star';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


async function insertPremium(data) {
    fetch('https://currenger.herokuapp.com/profile/setPremium', {
        method: "PUT",
        credentials: 'include',
        withCredentials: 'true',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    // .then(window.location.assign('http://localhost:3000'))
}

const Premium = () => {

    const [premiumPopup, setPremiumPopup] = useState(false);

    function handlePremium() {
        insertPremium({ "is_premium": true })
    }

    const sectionStyle = { minWidth: "inherit", maxWidth: "300px", width: "150px", height: "300px", flexGrow: "2", textAlign: "center" }
    const sectionStyleOpacity = {
        minWidth: "inherit", maxWidth: "300px", width: "150px", height: "300px", flexGrow: "2", textAlign: "center",
        opacity: "0.5"
    }

    return (
        <div className="page">
            <span className="page-header">P R E M I U M &nbsp; M E M B E R S H I P</span>
            <div className="section-row" style={{ gap: "10px" }}>

                <section className="small-section" style={sectionStyleOpacity}>
                    <span className="section-header" style={{ fontWeight: "bold" }}>1 Month</span>
                    <span style={{ fontSize: "26px", marginTop: "100px", display: "block" }}>UNAVAILABLE</span>
                </section>
                <section className="small-section" style={sectionStyleOpacity}>
                    <span className="section-header" style={{ fontWeight: "bold" }}>1 Year</span>
                    <span style={{ fontSize: "26px", marginTop: "100px", display: "block" }}>UNAVAILABLE</span>
                </section>
                <section className="small-section" style={sectionStyle}>
                    <span className="section-header" style={{ fontWeight: "bold" }}>LIFETIME MEMBERSHIP</span>
                    <div style={{ marginTop: "30px", marginLeft: "20px" }}>
                        <ul style={{ textAlign: "left" }}>
                            <li><span> ACCESS ALL STRATEGIES</span></li><br />
                            <li><span> Customer Support</span></li><br />
                            <li><span> Another thing</span></li><br />
                            <li><span> And even another thing</span></li>
                        </ul>
                    </div>
                    <Button aria-label="premium" variant="contained" onClick={() => handlePremium()} startIcon={<StarIcon />}
                        style={{ marginTop: "70px", backgroundColor: "gold", position: "relative", bottom: "10px" }}>
                        <span style={{ fontSize: "11px" }}>Become a Premium Member</span>
                    </Button>
                </section>
            </div>

        </div>
    )
}

export default Premium
