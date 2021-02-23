import React from 'react';
import Button from '@material-ui/core/Button';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@material-ui/core';

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
        .then(data => console.log(data)) 
        .catch(err => console.log(err)) 
}

export const loginButton = (
    <Button size="large" variant="contained" style={{ opacity: "0.8" }} type="submit">
        <b>Login</b>
    </Button>
)

const Login = (props) => {
    console.log(props);
    const { control, handleSubmit } = useForm();
    const onSubmit = (data) => {
        async function insert(data) {
            await insertUserApi(data);
        }
        insert(data);
        props.setHasBinanceAPI(true);
        window.location.replace("/dashboard");
    }

    const formStyle = {
        fontFamily: 'ubuntu',
        padding: "20px",
        color: "#1c316d",
        textAlign: "center"

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
            <h2 style={{ textAlign: "center", marginBottom: "30px" }} >Login</h2>
            <Controller as={Input} type="text" name="binance_key" control={control} placeholder="Binance API Key ..." defaultValue="" /><br /><br />
            <Controller as={Input} type="password" name="binance_private" control={control} placeholder="Binance API Private ..." defaultValue="" /><br /><br />
            {loginButton}
        </form>
    )
}

export default Login;