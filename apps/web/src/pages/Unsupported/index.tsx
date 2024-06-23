import React from "react";
import "./unsupported.css";
import network from "../../assets/images/network.gif";

export default function Unsupported() {
  return (
    <div className="container">
      <div className="flexContainer">
        <div className="netIcon">
          <img src={network}></img>
        </div>
        <div className="flexInfo">
          <div className="info1">
            Your wallet is connected to unsupported chain
          </div>
          <div className="info2">Click button below to change chain</div>
        </div>
        <button className="switch">Switch to Mode</button>
      </div>
    </div>
  );
}
