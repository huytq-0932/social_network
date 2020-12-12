import React, {useEffect, useState} from 'react';
const getConfig = require("next/config").default;
const { publicRuntimeConfig } = getConfig();
const ENDPOINT = publicRuntimeConfig.SOCKET_HOST;
import auth from "@src/utils/auth"
import io from "socket.io-client";
import _ from "lodash"
let socket: any;

const Chatbox = () => {
	const [chats, setChats] = useState([]);
	const [messages, setMessages] = useState([])
	const initSocket = () => {
		
		console.log("${ENDPOINT}?token=${auth().token} ",` ${ENDPOINT}?token=${auth().token}`)
		// @ts-ignore
		socket = io(`${ENDPOINT}?token=${auth().token}`);
		socket.emit("join", { id: "1" }, (error: Error) => {
		  if (error) {
			alert(error);
		  }
		});
		socket
		  .on("connect", () => {
			console.log("Successfull Hand Shake");
		  })
		  .on("error", function (err: any) {})
		  .on("active", (userIds: number[]) => {
			// lúc có user đang vào phòng
			// setActive([...userIds]);
		  })
		  .on("message", (message: any) => {
			if(!message) return;
			// let type = auth().user == message.userId? "sent": "received";
			setMessages((messages: any) => [
			  ...messages,
			//   { ...message, type },
			]);
		  });
	  };
	useEffect(() => {
		initSocket();
	  }, []);
	useEffect(() => {
				// const chatRef = firebase.database().ref('general');
		// chatRef.on('value', snapshot => {
		// 	const getChats = snapshot.val();
		// 	let ascChats = [];
		// 	for(let chat in getChats){
		// 		if(getChats[chat].message !== ''){
		// 			ascChats.push({
		// 				id: chat,
		// 				message: getChats[chat].message,
		// 				user: getChats[chat].user,
		// 				date: getChats[chat].timestamp
		// 			});
		// 		}
		// 	}
		// 	const chats = ascChats.reverse();
		// 	this.setState({chats});
		// });
	}, [])
	return(
		<div className="chatbox">
			<ul className='chat-list'>
				{chats.map(chat => {
					const postDate = new Date(chat.date);
					return(
						<li key={chat.id}>
							<em>{postDate.getDate() + '/' + (postDate.getMonth()+1)}</em>
							<strong>{chat.user}:</strong> 
							{chat.message}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
export default Chatbox;