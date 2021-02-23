import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from "@material-ui/core";

async function insertUserApi(data) {
    var new_data = { binance_key: data.binance_key, binance_private: data.binance_private };
    fetch('https://currenger.herokuapp.com/profile/', {
        method: 'PUT',
        body: JSON.stringify(new_data),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        withCredentials: 'true'
    })
        .then(window.location.replace("/Dashboard"))
        .catch(err => console.log(err))
}

const Settings = () => {
    const { control, handleSubmit } = useForm();
    const onSubmit = data => {
        insertUserApi(data);
    }

    const form = (
        <form form onSubmit={handleSubmit(onSubmit)} style={{ margin: "20px auto" }}>
            <Controller as="input" defaultValue="" control={control} type="text"
                name="binance_key" placeholder="Insert Api Key ..." /><br /><br />
            <Controller as="input" defaultValue="" control={control} type="text"
                name="binance_private" placeholder="Insert Api Secret ..." /><br />
            <br />
            <Button type="submit" variant="contained" >EDIT API</Button>
        </form >
    )
    return (
        <div className="page">
            <span className="page-header">S E T T I N G S</span>
            <section className="big-section" style={{ textAlign: "center" }}>
                <span className="section-header">Configure API</span>
                {form}
            </section>
        </div>
    )
}

export default Settings
