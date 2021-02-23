import React from 'react';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@material-ui/icons/Dashboard';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import SettingsIcon from '@material-ui/icons/Settings';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import StarIcon from '@material-ui/icons/Star';

const Nav = () => {
    const activeStyle = {
        color: "#333",
        fontWeight: "bold"
    }

    const DashboardLink = (
        <NavLink to="/Dashboard" activeStyle={activeStyle}>
            <li >
                <DashboardIcon fontSize="large" />
                <div className="li-content" >Dashboard</div>
            </li>
        </NavLink>
    )

    const StrategiesLink = (

        <NavLink to="/Strategies" activeStyle={activeStyle}>
            <li>
                <EmojiObjectsIcon fontSize="large" />
                <div className="li-content" >Strategies</div>
            </li>
        </NavLink>
    )
    const SettingsLink = (

        <NavLink to="/Settings" activeStyle={activeStyle} >
            <li>
                <SettingsIcon fontSize="large" />
                <div className="li-content" >Settings</div>
            </li>
        </NavLink>
    )

    const ManualOrderLink = (
        <NavLink to="/Manual_Order" activeStyle={activeStyle}>
            <li>
                <AddShoppingCartIcon fontSize="large" />
                <div className="li-content" >Manual<br />Order</div>
            </li>
        </NavLink>
    )

    const PremiumLink = (
        <NavLink to="/Premium" activeStyle={activeStyle} >
            <li style={{ height: "40px" }} >
                <StarIcon fontSize="large" style={{ color: "#bba31c" }} />
                <div className="li-content" style={{ color: "#bba31c", fontSize: "14px" }}>
                    <b>Premium<br />
                    Membership
                    </b>
                </div>
            </li>
        </NavLink>
    )

    return (
        <nav>
            <ul>
                {DashboardLink}
                {StrategiesLink}
                {ManualOrderLink}
                {SettingsLink}
            </ul>
            <ul style={{ transform: "translateY(0)", top: "inherit", bottom: "30px", height: "80px" }}>
                {PremiumLink}
            </ul>
        </nav>
    )
}

export default Nav
