import React from 'react'

const Loading = (data, isLoading) => {
    const loaderGif = process.env.PUBLIC_URL + '/img/loader_small.gif';

    if (isLoading)
        return (
            <div style={{ display: "flex", textAlign: "center", justifyContent:"center", alignItems:"center", height:"90%" , fontSize:"26px", color:"#222"}} >
                <img src={loaderGif} alt="loading_gif" /> &nbsp;
                <div className="fade-in-slow" >Loading</div>
            </div >
        );

    if (!data) return (
        <span>Data not available</span>
    );
}

export default Loading
