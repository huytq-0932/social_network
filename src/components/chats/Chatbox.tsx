import React, { useEffect, useState } from "react";
const queryString = require("query-string");
import allService from "@src/services/allService";
const getConfig = require("next/config").default;
const { publicRuntimeConfig } = getConfig();
const ENDPOINT = publicRuntimeConfig.SOCKET_HOST;
import { Form, Input, Button, Checkbox } from "antd";
import moment from "moment";

import auth from "@src/utils/auth";
import io from "socket.io-client";
import to from "await-to-js";
import _ from "lodash";
let socket: any;
let toUser = { id: "" };
const Chatbox = () => {
  const [chats, setChats] = useState([]);
  const fromId = _.get(auth(), "user.id");
  const [messages, setMessages] = useState([]);
  const initSocket = () => {
    // @ts-ignore
    socket = io(`${ENDPOINT}?token=${auth().token}`);
    socket.emit("join", { fromId: fromId, toId: toUser.id }, (error: Error) => {
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
        if (!message) return;
        setMessages((messages: any) => [
          ...messages,
            message
        ]);
      });
  };

  const onSendMessage = (values) => {
    event.preventDefault();
    // setSentLoading(true);
    socket.emit(
      "sendMessage",
      { message: values.message, fromId: fromId, toId: toUser.id },
      () => {
        // setMessage("");
        // setSentLoading(false);
      }
    );
  };

  useEffect(() => {
    const parsed = queryString.parse(location.search);
	let phonenumber = parsed.phonenumber;
	console.log("auth ", auth().user)
    async function fetch() {
      let [error, _toUser = {}] = await to(
        allService().withAuth().getByPhone(phonenumber)
      );
      if (error) {
        alert(error.message);
        return;
      }
      toUser = _toUser;
      initSocket();
    }
    fetch();
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
  }, []);

  return (
    <div>
      <Form
        name="inbox"
        // layout="inline"
        initialValues={{ remember: true }}
        onFinish={onSendMessage}
      >
        <Form.Item
          name="message"
          rules={[{ required: true, message: "Vui lòng nhập tin nhắn!" }]}
        >
          <Input placeholder="Nhập tin nhắn" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Gửi
          </Button>
        </Form.Item>
      </Form>
      <div className="chatbox">
        <ul className="chat-list">
          {messages.map((chat) => {
            const postDate = new Date(chat.createdAt);
            return (
              <li key={chat.id}>
                <em>{postDate.getDate() + "/" + (postDate.getMonth() + 1)}</em>
                <strong>{chat.fromid} đến {chat.toId}:</strong>
                {chat.content}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default Chatbox;
