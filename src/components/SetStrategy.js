import React, { useState } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import strategies from './../data/strategies.json'
import NumericInput from 'react-numeric-input';
import AddIcon from '@material-ui/icons/Add';
import { Button } from "@material-ui/core";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

const symbols = [
    { value: 'DOGEBTC', label: 'DOGE/BTC' },
    { value: 'ETHBTC', label: 'ETH/BTC' },
    { value: 'LTCBTC', label: 'LTC/BTC' },
    { value: 'BNBBTC', label: 'BNB/BTC' },
    { value: 'XRPBTC', label: 'XRP/BTC' },
    { value: 'ADABTC', label: 'ADA/BTC' }
];

async function addStrategy(data) {
    await fetch('https://currenger.herokuapp.com/api/strategy/', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => console.log(response));
}


const SetStrategy = ({ match }) => {
    const [isPopupOpen, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    const [selected, setSelected] = useState();
    const { control, handleSubmit } = useForm();
    const onSubmit = async (data) => {
        data.strategy_type = match.params.strategyName.replaceAll("_", " ");
        data.currency = data.currency.value;
        await addStrategy(data);
        handleSubmitPopup();
    }

    function handleSubmitPopup() {
        setOpen(!isPopupOpen);
    }

    function chooseSelected(opt) {
        setSelected(opt);
    }


    function percentFormat(num) {
        return num + '%'
    }
    
    function amountFormat(num) {
        if (!selected) {
            return "0"
        }
        const currency = selected.label.slice(0, -4);
        return (num + " " + currency);
    }

    return (
        <div className="page">
            <div className="page-header">S T R A T E G I E S → {match.params.strategyName.replaceAll("_", " ")}</div>
            <section className="big-section" style={{ width: "50%", margin: "0 auto" }}>
                <span className="section-header">Strategy Configuration</span>
                <div className="wrapper" style={{ textAlign: "center" }} >
                    <form onSubmit={handleSubmit(onSubmit)} style={{ margin: "20px auto" }}>
                        <Controller
                            name="currency"
                            control={control}
                            defaultValue={symbols[0]}
                            render={({ onChange }) => (
                                <Select
                                    options={symbols}
                                    placeholder="Choose coin ..."
                                    isSearchable
                                    onChange={e => {
                                        onChange(e)
                                        chooseSelected(e)
                                    }}

                                />)}
                        />
                        <br /><br />
                        <label>Amount:</label><br />
                        <Controller as={NumericInput} name="amount" defaultValue={0} control={control} min={1} max={9999999} step={1}
                            placeholder="Amount ..." format={amountFormat} /> <br /><br />
                        <label >Profit target:</label><br />
                        <Controller as={NumericInput} name="take_profit" defaultValue={0} control={control} min={3} max={10} step={1}
                            placeholder="Profit target  ..." format={percentFormat} /> <br /><br />
                        <label>Stop loss:</label><br />
                        <Controller as={NumericInput} name="stop_loss" defaultValue={0} control={control} min={3} max={10} step={1}
                            placeholder="Stoploss  ..." format={percentFormat} /> <br /><br />
                        <Button type="submit" variant="contained" size="large"
                            style={{ background: "#1c316d", color: "white" }}
                            startIcon={<AddIcon />}>
                            Add Strategy
                         </Button>
                    </form>
                    <Popup open={isPopupOpen} closeOnDocumentClick onClose={closeModal}>
                        <div className="modal">
                            <a className="close" onClick={closeModal}>&times;</a>
                            <AssignmentTurnedInIcon style={{ fontSize: 80, color: "green" }} /><br />
                                    <span style={{color:"green"}}>New strategy added successfully !</span>
                            </div>
                    </Popup>
                </div>
            </section>
        </div >
    )
}

export default SetStrategy
