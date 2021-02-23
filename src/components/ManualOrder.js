import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import NumericInput from 'react-numeric-input';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import { render } from '@testing-library/react';

const symbols = [
    { value: 'DOGEBTC', label: 'DOGE/BTC' },
    { value: 'ETHBTC', label: 'ETH/BTC' },
    { value: 'LTCBTC', label: 'LTC/BTC' },
    { value: 'BNBBTC', label: 'BNB/BTC' },
    { value: 'XRPBTC', label: 'XRP/BTC' },
    { value: 'ADABTC', label: 'ADA/BTC' }
];

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const ManualOrder = ({ match }) => {
    const [selected, setSelected] = useState(undefined);    // symbol
    const [amount, setAmount] = useState(0);                // amount
    const [currencyPrice, setCurrencyPrice] = useState(0);  // price
    const [limitPrice, setLimitPrice] = useState(0);  // Limit price (user choosing..)
    const [actionType, setActionType] = useState("");       // buy/sell
    const [orderType, setOrderType] = useState("market");   // market/limit
    const { control, handleSubmit } = useForm();            //form

    const classes = useStyles();

    // useEffect(() => {
    // }, []);

    const handleOrderTypeChange = (event, currentOrderType) => {
        setOrderType(currentOrderType);
    };

    const onSubmit = async (data) => {
        console.log(data);
        data.symbol = data.symbol.value;
        data.action_type = actionType;
        if (orderType === "limit")
            data.price = data.price.toFixed(8);

        orderType === "market" ?
            await addMarketOrder(data) :
            await addLimitOrder(data);
    }

    async function showPrice(selected) {
        const url = `https://currenger.herokuapp.com/api/binance/getPriceForSymbol/${selected}`;
        const response = await fetch(url, {
            credentials: 'include',
            withCredentials: 'true',
        })
        const commits = await response.json();
        setCurrencyPrice(commits.bidPrice);
    }

    async function addMarketOrder(data) {
        await fetch('https://currenger.herokuapp.com/api/binance/marketOrder/', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    async function addLimitOrder(data) {
        await fetch('https://currenger.herokuapp.com/api/binance/limitOrder/', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    function chooseSelected(opt) {
        setSelected(opt);
    }

    function amountFormat(amount) {
        if (!selected) {
            return amount + ""
        }
        const currency = selected.label.slice(0, -4);
        return amount + " " + currency;
    }

    function floatFormat(price) {
        return price.toLocaleString('fullwide', { useGrouping: false });
    }
    return (
        <div className="page">
            <span className="page-header" >M A N U A L &nbsp; O R D E R</span>

            <section className="big-section" style={{ margin: "0 auto" }}>
                <Paper className={classes.root}>
                    <Tabs
                        value={orderType}
                        variant='fullWidth'
                        onChange={handleOrderTypeChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="MARKET" value="market" />
                        <Tab label="LIMIT" value="limit" />
                    </Tabs>
                </Paper>

                <div className="wrapper" style={{ textAlign: "center", width: "50%" }} >

                    <form onSubmit={handleSubmit(onSubmit)} style={{ margin: "20px auto" }}>
                        <Controller
                            name="symbol"
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
                                        showPrice(e.value)
                                    }}
                                />)}
                        />
                        <label style={{ display: "block", marginTop: "20px" }}>
                            {selected ? `Current Price: ` : ``}
                        </label>
                        <span>
                            {selected ?
                                `1 ${selected.label.slice(0, selected.label.indexOf('/'))} = `
                                + currencyPrice + ' BTC' :
                                ``}
                        </span>
                        <br /><br />

                        <label>Amount:</label>
                        <Controller
                            name="quantity"
                            control={control}
                            defaultValue={"0.0"}
                            render={({ onChange }) => (
                                <NumericInput
                                    min={0.01}
                                    max={9999999}
                                    step={0.01}
                                    placeholder="0.0"
                                    onChange={e => {
                                        onChange(e)
                                        setAmount(e)
                                    }}
                                    format={amountFormat}
                                />
                            )
                            }
                        />

                        <br /><br />

                        <div>
                            <label>Price:</label>
                            <Controller
                                name="price"
                                control={control}
                                defaultValue={0}
                                render={({ onChange }) => (
                                    <NumericInput
                                        disabled={orderType === "market" ? true : false}
                                        min={0.00000001}
                                        max={1000}
                                        step={0.000001}
                                        precision={8}
                                        onChange={e => {
                                            onChange(e)
                                            setLimitPrice((e))
                                            console.log(limitPrice)
                                        }}
                                        format={floatFormat}
                                        defaultValue={currencyPrice.toString()}
                                        placeholder={orderType === "market" ? "MARKET PRICE" : "0.00000001"}
                                    />

                                )
                                }
                            />
                        </div>





                        <br /><br />

                        <label><b>Total Price: </b></label><br />
                        {
                            orderType === "market" ?
                                <span>{(Number(amount) * Number(currencyPrice)).toFixed(8)} BTC</span>
                                :
                                <span>{(Number(amount) * Number(limitPrice)).toFixed(8)} BTC</span>
                        }


                        <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "50px" }}>
                            <Button onClick={() => setActionType("buy")} type="submit" name="buy" variant="contained" size="large" style={{ background: "green", color: "white", width: "100px" }} >
                                BUY !
                                </Button>
                            <Button onClick={() => setActionType("sell")} type="submit" name="sell" variant="contained" size="large" style={{ background: "red", color: "white", width: "100px" }} >
                                SELL !
                                </Button>
                        </div>

                    </form>
                </div>
            </section>
            {/* <section className="small-section" style={{ margin: "0 auto", height: "400px" }}>
                    <span className="section-header" style={{ color: "#444" }} >Market <b>SELL</b> Order</span>
                </section> */}

        </div>
    )
}

export default ManualOrder
