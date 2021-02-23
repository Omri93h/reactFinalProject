import PieChart from './PieChart';
import { useState, useEffect } from 'react';
import Loading from './Loading';
import btcIcon from 'cryptocurrency-icons/32/icon/btc.png'
import RefreshIcon from '@material-ui/icons/Refresh';
import { IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

const Dashboard = ({ balance, orders, totalValue }) => {
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        async function getBalance() {
            const url = 'https://currenger.herokuapp.com/api/portfolio/';
            const response = await fetch(url, {
                credentials: 'include',
                withCredentials: 'true',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const balance = await response.json();
            console.log(response);
            const data = []
            for (const i in balance) {
                balance[i].id === 'BTC' ?
                    balance[i].amount = parseFloat(Number(balance[i].amount).toFixed(5))
                    :
                    balance[i].amount = parseFloat(Number(balance[i].amount).toFixed(3))

                const currCoinValue = balance[i].value.toFixed(1)

                data.push({
                    "id": balance[i].id, "label": balance[i].id + " (" + balance[i].amount + ")",
                    "amount": balance[i].amount, "value": currCoinValue,
                })
            }
            return data;
        }

        async function getTotalValue(balance) {
            const url = 'https://currenger.herokuapp.com/api/binance/getBTCUSD';
            const response = await fetch(url, {
                credentials: 'include',
                withCredentials: 'true'
            });
            const btcPrice = await response.json();
            const userTotalValue = { USD: 0, BTC: 0 };
            for (const i in balance) {
                userTotalValue.USD += Number(balance[i].value)
            }
            userTotalValue.USD = userTotalValue.USD.toFixed(1);
            userTotalValue.BTC = (userTotalValue.USD / btcPrice).toFixed(5);
            return userTotalValue;
        }

        async function getOrders() {
            const url = 'https://currenger.herokuapp.com/api/orders';
            const response = await fetch(url, {
                credentials: 'include',
                withCredentials: 'true'
            });
            const userOrders = await response.json();
            return userOrders;
        }

        async function userData() {
            try {
                let userCurrentBalance = balance.userBalance;
                let userOrders = null;
                let total = 0;
                setLoading(true);
                if (!balance.userBalance || refresh) {
                    userCurrentBalance = await getBalance();
                    balance.setUserBalance(userCurrentBalance);
                    userOrders = await getOrders();
                    orders.setUserOrders(userOrders);
                    total = await getTotalValue(userCurrentBalance);
                    totalValue.setUserTotal(total);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                return (<div>"ERROR LOADING"</div>)
            }
        }

        (async function refreshBalance() {
            if (refresh) {
                await userData();
                setRefresh(false)
            }
        })()

        userData();
    }, [refresh]);

    const positionsDataStyle = {
        marginTop: "10px",
        display: "table",
        width: "100%",
    }

    const tableCell = {
        height: "30px",
        display: "table-cell",
        textAlign: "center",
        maxWidth: "40px",
    }

    const orderDataStyle = {
        lineHeight: "24px",
        fontSize: "18px"
    }

    return (
        <div className="page">
            <span className="page-header">D A S H B O A R D</span>
            <div className="section-row">
                <section className="small-section">
                    <div className="section-header" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Currenger Balance</span>
                        <IconButton style={{ width: "18px", marginTop: "-3px" }} onClick={() => setRefresh(true)}>
                            <RefreshIcon style={{ width: "18px" }} />
                        </IconButton>
                    </div>
                    {loading ?
                        <Loading data={balance.userBalance} isLoading={loading} />
                        :
                        <div className="fade-in-fast">
                            <div style={{ margin: "0 auto", height: "180px", display: "block", maxWidth: "360px", marginTop: "10px" }}>
                                {
                                    balance.userBalance ?
                                        < PieChart data={balance.userBalance} />
                                        : <div></div>
                                }
                            </div>
                        </div>
                    }
                </section>

                <section className="small-section">
                    <span className="section-header">Total Value</span>
                    {loading || !(totalValue.userTotal.BTC) ?
                        <Loading data={balance.userBalance} isLoading={loading} />
                        :
                        <div className="fade-in-fast" style={{ textAlign: "center", marginTop: "50px" }}>
                            <div style={{ fontSize: "40px", display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
                                <span><b>{totalValue.userTotal.BTC}</b> </span>
                                <img src={btcIcon} alt="btc-icon" />
                            </div>
                            <span style={{ fontSize: "25px", fontWeight: "lighter" }}>
                                ≈ {totalValue.userTotal.USD}$
                            </span>
                        </div>
                    }

                </section>
            </div>

            <section className="big-section">
                <span className="section-header">Open Orders</span>

                {orders.userOrders ?

                    <div className="fade-in-fast" style={positionsDataStyle}>
                        <div id="symbol" style={tableCell}>
                            <div className="table-cell-header" >Symbol</div>
                            {orders.userOrders.map((order, i) => (
                                <div key={i} style={orderDataStyle} >
                                    {order.symbol}
                                </div>))
                            }
                        </div>
                        <div id="amount" style={tableCell}>
                            <div className="table-cell-header">Amount</div>
                            {orders.userOrders.map((order, i) => (
                                <div key={i + 100} style={orderDataStyle} >
                                    {parseFloat(order.origQty)}
                                </div>))}
                        </div>
                        <div id="action" style={tableCell}>
                            <div className="table-cell-header">Action</div>
                            {orders.userOrders.map((order, i) => (
                                <div key={i + 1000} style={orderDataStyle}>
                                    <span style={order.side === "BUY" ? { color: "green" } : { color: "red" }}>
                                        {order.side}
                                    </span>
                                </div>))}
                        </div>
                        <div id="price" style={tableCell} >
                            <div className="table-cell-header">Price</div>
                            {orders.userOrders.map((order, i) => (
                                <div style={orderDataStyle} key={i + 10000}> {order.price}</div>))}
                        </div>
                        <div id="status" style={tableCell}>
                            <div className="table-cell-header">Status</div>
                            {orders.userOrders.map((order, i) => (
                                <div style={orderDataStyle} key={i + 100000}> {order.status}</div>
                            ))}
                        </div>
                        <div id="cancel" style={tableCell}>
                            <div className="table-cell-header">Cancel</div>
                            {orders.userOrders.map((order, i) => (
                                <div style={orderDataStyle} key={i + 1000000}>
                                    <CancelIcon
                                        style={{ height: "20px", color: "red" }}
                                        variant="contained"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    :
                    ""}

            </section>

        </div >
    )
}

export default Dashboard
