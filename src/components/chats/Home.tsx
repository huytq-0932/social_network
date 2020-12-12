import React, { useState, useEffect } from "react";
import auth from "@src/utils/auth";
// import firebase from '../../firebase';

import "./Home.less";

import Chatbox from "./Chatbox";

const Home = () => {
  const [message, setMessage] = useState("");
  const token = auth().token;
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if(this.state.message !== ''){
    // 	const chatRef = firebase.database().ref('general');
    // 	const chat = {
    // 		message: this.state.message,
    // 		user: this.props.user.displayName,
    // 		timestamp: new Date().getTime()
    // 	}

    // 	chatRef.push(chat);
    // 	this.setState({message: ''});
    // }
  };
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
