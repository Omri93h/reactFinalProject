import { Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import strategies from './../data/strategies.json'
import { Switch, Route, Link } from 'react-router-dom';
import SetStrategy from './SetStrategy';
import Loading from './Loading';
import { Button } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useForm, Controller } from 'react-hook-form';
import NumericInput from 'react-numeric-input';


async function deleteActiveStrategy(strategy_id) {
    await fetch(`https://currenger.herokuapp.com/api/strategy/${strategy_id}`, {
        method: "DELETE",
        credentials: 'include',
        withCredentials: 'true'
    })
}

async function editActiveStrategy(strategy) {
    await fetch(`https://currenger.herokuapp.com/api/strategy/${strategy.id}`, {
        method: "PUT",
        credentials: 'include',
        withCredentials: 'true',
        body: JSON.stringify(strategy),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(data => console.log(data))
}

async function getActiveStrategies(setLoading, setActiveStrategies) {
    let res = await fetch('https://currenger.herokuapp.com/api/strategy', {
        credentials: 'include',
        withCredentials: 'true',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
    res = await res.json();
    setActiveStrategies(res);
    setLoading(false)
}

const Strategies = ({ userData }) => {
    const [activeStrategies, setActiveStrategies] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const [currentStrategyId, setCurrentStrategyId] = useState(undefined);
    const [currentStrategyName, setCurrentStrategyName] = useState("");
    const [currentStrategyType, setCurrentStrategyType] = useState("");
    const [isPremiumPopup, setPremiumPopup] = useState(false);
    const [isDeleteVerifyPopup, setDeleteVerifyPopup] = useState(false);
    const [isEditPopup, setEditPopup] = useState(false);

    const { control, handleSubmit } = useForm();

    useEffect(() => {
        setLoading(true);
        setActiveStrategies(undefined);
        getActiveStrategies(setLoading, setActiveStrategies);
    }, []);

    const onSubmit = async (data) => {
        setEditPopup(false)
        data.id = currentStrategyId;
        editActiveStrategy(data);
        getActiveStrategies(setLoading, setActiveStrategies);
    }

    const closeModal = () => {
        setPremiumPopup(false);
        setDeleteVerifyPopup(false);
        setEditPopup(false);
    }

    const StrategyPage = [];
    strategies.forEach((strategy) => (
        StrategyPage.push(strategy.name.replaceAll(" ", "_"))
    ));

    function handleDeleteVerifyPopup(strategy_id) {
        setDeleteVerifyPopup(!isDeleteVerifyPopup);
        setCurrentStrategyId(strategy_id);
    }

    function handleDelete(strategy_id) {
        deleteActiveStrategy(strategy_id);
        setActiveStrategies(activeStrategies.filter(i => i.strategy_id !== strategy_id))
    }

    function handleEditPopup(strategy_id) {
        setEditPopup(!isEditPopup);
        setCurrentStrategyId(strategy_id);
    }

    // function handleEdit() {
    //     console.log("EDIT");
    //     const strategy = {
    //         id: currentStrategyId,
    //         amount: 30,
    //         stop_loss: 6,
    //         take_profit: 7
    //     }
    //     console.log(strategy);

    //     // setActiveStrategies(activeStrategies.filter(i => i.strategy_id !== strategy_id))
    // }



    function handlePremiumPopup(isPremiumStrategy, isPremiumUser) {
        if (isPremiumStrategy && !isPremiumUser) {
            setPremiumPopup(!isPremiumPopup)
        }
    }

    function amountFormat(num) {
        const currency = `${currentStrategyName}`.slice(0, -3);
        return (num + " " + currency);
    }

    function percentFormat(num) {
        return num + '%'
    }
    const dataForm = (
        <div>
            <Controller as={NumericInput} name="amount" defaultValue={1} control={control} min={0.01} max={9999999} step={0.01}
                placeholder="Amount ..." format={amountFormat} /> <br /><br />

            <label >Profit target:</label><br />
            <Controller as={NumericInput} name="take_profit" defaultValue={0} control={control} min={3} max={10} step={1}
                placeholder="Profit target  ..." format={percentFormat} /> <br />

            <label>Stop loss:</label><br />
            <Controller as={NumericInput} name="stop_loss" defaultValue={0} control={control} min={3} max={10} step={1}
                placeholder="Stoploss  ..." format={percentFormat} /> <br />

            <br />
        </div>
    )
    const deleteIconStyle = { position: "absolute", right: "0", zIndex: "1" };
    const editIconStyle = { position: "absolute", left: "0", zIndex: "1" };

    const cardContentStyle = {
        marginTop: "40px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontSize: "14px"
    }

    const buttonContainer = {
        display: "flex",
        flexDirection: "row",
        width: "200px",
        justifyContent: "space-between",
        margin: "0 auto"
    }

    const strategiesPage = () => {
        return (
            <div className="page">
                <span className="page-header">S T R A T E G I E S</span>
                <section className="big-section" id="active-strategies">
                    <span className="section-header">My Strategies</span>
                    <Grid container spacing={3} justify="center" alignItems="center">
                        <Grid container item xs={12} spacing={3}>
                            {loading ?
                                <Loading activeStrategies={activeStrategies} isLoading={loading} />
                                :
                                activeStrategies.map((activeStrategy) => (
                                    <div className="active-strategy" key={activeStrategy.strategy_id}>
                                        <IconButton aria-label="delete" onClick={() => {
                                            handleDeleteVerifyPopup(activeStrategy.strategy_id)
                                            setCurrentStrategyName(activeStrategy.currency);
                                            setCurrentStrategyType(activeStrategy.strategy_type);
                                        }}
                                            style={deleteIconStyle}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton aria-label="edit" onClick={() => {
                                            handleEditPopup(activeStrategy.strategy_id)
                                            setCurrentStrategyName(activeStrategy.currency);
                                            setCurrentStrategyType(activeStrategy.strategy_type);
                                        }}
                                            style={editIconStyle}>
                                            <EditIcon />
                                        </IconButton>

                                        <div className="card-header"> {activeStrategy.currency}</div>
                                        <div className="card-content"
                                            style={cardContentStyle}>
                                            <div style={{ fontSize: "13px" }}>
                                                {
                                                    activeStrategy.status === "waiting_to_buy" ?
                                                        <span style={{ color: "green" }}>Waiting To <b>BUY</b></span> :
                                                        <span style={{ color: "red" }}>Waiting To <b>SELL</b></span>
                                                }
                                            </div><br /><br />
                                            <span style={{ fontFamily: "monospace", fontSize: "22px" }}> {activeStrategy.strategy_type}</span>
                                            <br /><br />
                                            <span>Amount:  <b>{activeStrategy.amount + " " +
                                                activeStrategy.currency.slice(0, -3)} </b></span>
                                            <span>Expected Profit:  <b>{activeStrategy.take_profit}%</b></span>
                                            <span>Stop Loss at:  <b>{activeStrategy.stop_loss}%</b></span>
                                        </div>
                                    </div>
                                ))
                            }
                        </Grid>
                    </Grid>
                    <div id="active-strategies-container"></div>
                </section>

                <section className="big-section">
                    <div className="section-header">Add Strategy</div>
                    <Grid container spacing={3} justify="center" alignItems="center">
                        <Grid container item xs={12} spacing={3}>
                            {strategies.map((strategy) => (
                                <Link
                                    key={strategy.id}
                                    to={
                                        strategy.isPremium && !userData.is_premium ?
                                            '/Strategies'
                                            :
                                            `Strategies/${StrategyPage[strategy.id]}`}
                                >
                                    <div className="card" key={strategy.id}
                                        onClick={() => handlePremiumPopup(strategy.isPremium, userData.is_premium)}>
                                        <div className="card-header">{strategy.name}</div>
                                        <img className="card-image" src={strategy.img} alt={strategy.name} />
                                    </div>
                                </Link>
                            ))
                            }
                            <Popup open={isPremiumPopup} onClose={closeModal}>
                                <div className="modal">
                                    <a className="close" onClick={closeModal}></a> <br />
                                    <AssignmentLateIcon style={{ fontSize: 80, color: "grey" }} /><br />
                                    <div style={{color:"red", fontSize:"30px"}}>
                                        This option is available for Premium Members only!
                                    </div>
                                </div>
                            </Popup>
                        </Grid>
                    </Grid>
                </section>

                <Popup open={isDeleteVerifyPopup} closeOnDocumentClick onClose={closeModal}>
                    <div className="modal">
                        <a className="close" onClick={closeModal}></a>
                        <AssignmentLateIcon style={{ fontSize: 80, color: "orange" }} /><br />
                        <span style={{ color: "#888" }}>
                            Delete this strategy?
                            </span>
                        <br />

                        <div style={{ margin: "50px 0px 20px 0px", display: "flex", justifyContent: "space-around" }}>
                            <Button
                                variant="contained"
                                style={{ background: "#435279", color: "white" }}
                                onClick={() => {
                                    handleDelete(currentStrategyId)
                                    setDeleteVerifyPopup(false)
                                }}>
                                Yes, Delete it
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() =>
                                    setDeleteVerifyPopup(false)
                                }>
                                No
                        </Button>
                        </div>
                    </div>
                </Popup>

                <Popup open={isEditPopup} closeOnDocumentClick onClose={(closeModal) => setEditPopup(false)}>
                    <div className="modal">
                        <a className="close" onClick={closeModal}></a>
                        <AssignmentLateIcon style={{ fontSize: 80, color: "blue" }} /><br />
                        <span style={{ color: "#888" }}>
                            Edit <b>{currentStrategyType} </b> Strategy
                            <br /><br />
                            <i>{currentStrategyName}</i>
                        </span>
                        <br />

                        <form onSubmit={handleSubmit(onSubmit)} style={{ margin: "20px auto" }}>
                            <div style={{ margin: "10px 0px 10px 0px", fontSize: "14px" }}>

                                {dataForm}
                                <div style={buttonContainer}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        style={{ background: "#435279", color: "white" }}>
                                        Apply
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            setEditPopup(false)
                                        }>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Popup>
            </div >

        )
    }

    return (
        <div>
            <Switch>
                {StrategyPage.map(pageName =>
                    <Route path={("/strategies/" + pageName)} component={SetStrategy} key="setStrategy" />)
                }
                <Route path="/strategies" component={strategiesPage} key="strategies" />
            </Switch>
        </div >
    )
}

export default Strategies
