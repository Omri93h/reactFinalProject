import React from 'react'
import Button from '@material-ui/core/Button';
import StarIcon from '@material-ui/icons/Star';

async function insertPremium(data) {
    fetch('https://davidomriproject.herokuapp.com/profile/setPremium', {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

const Premium = () => {

    function handlePremium() {
        console.log("become premium");

        insertPremium({ "is_premium": true })
    }

    const sectionStyle = {minWidth:"inherit", maxWidth:"300px",width:"150px", height:"300px", flexGrow:"2"}

    return (
        <div className="page">
            <span className="page-header">P R E M I U M &nbsp; M E M B E R S H I P</span>
            <div className="section-row" style={{gap:"10px"}}>
                <section className="small-section" style={sectionStyle}>
                    <Button aria-label="premium" variant="contained" onClick={() => handlePremium()} startIcon={<StarIcon />} style={{ marginTop: "20px", backgroundColor: "gold" }}>
                        Become a Premium Member
                    </Button>
                </section>
                <section className="small-section" style={sectionStyle}>
                    <Button aria-label="premium" variant="contained" onClick={() => handlePremium()} startIcon={<StarIcon />} style={{ marginTop: "20px", backgroundColor: "gold" }}>
                        Become a Premium Member
                    </Button>
                </section>
                <section className="small-section" style={sectionStyle}>
                    <Button aria-label="premium" variant="contained" onClick={() => handlePremium()} startIcon={<StarIcon />} style={{ marginTop: "20px", backgroundColor: "gold" }}>
                        Become a Premium Member
                    </Button>
                </section>
            </div>

        </div>
    )
}

export default Premium
