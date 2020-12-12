import React, { useState, useEffect } from "react";
import auth from "@src/utils/auth";
// import firebase from '../../firebase';

import "./Home.less";

import Chatbox from "./Chatbox";

const Home = () => {
  return (
    <div className="home--container">
      <h1>Demo chat!</h1>
      
      <div className="allow-chat">
        <Chatbox />
      </div>
    </div>
  );
};
export default Home;
