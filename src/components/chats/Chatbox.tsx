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
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false);
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
        setMessages((messages: any) => [...messages, message]);
      });
  };

  const onSendMessage = async (values) => {
    setLoading(true)
    // setSentLoading(true);
    let [error, result] = await to(
      allService().withAuth().sendMessage({
        partner_id: toUser.id,
        message: values.message,
      })
    );
    setLoading(false)
    if (error) {
      alert(error.message);
      return;
    }
    form.setFieldValues({message: ""})
    socket.emit(
      "sendMessage",
      {
        message: values.message,
        fromId: fromId,
        toId: toUser.id,
        sender: auth().user,
      },
      () => {
        // setMessage("");
        // setSentLoading(false);
      }
    );
  };

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    let phonenumber = parsed.phonenumber;

    async function fetch() {
      let [error, _toUser = {}] = await to(
        allService().withAuth().getByPhone(phonenumber)
      );
      if (error) {
        alert(error.message);
        return;
      }
      toUser = _toUser;
      let [messageErr, _messages = {}] = await to(
        allService().withAuth().getConversation({
          index: 0,
          count: 100,
          partner_id: _toUser.id,
        })
      );
      if (messageErr) {
        alert(messageErr.message);
        return;
      }
      setMessages(_messages.conversations || []);
      console.log("_messages.conversations ", _messages.conversations);
      setDisabled(_messages.is_blocked);
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
        form={form}
      >
        <Form.Item
          name="message"
          rules={[{ required: true, message: "Vui lòng nhập tin nhắn!" }]}
        >
          <Input placeholder="Nhập tin nhắn" />
        </Form.Item>
        <Form.Item>
          <Button loading = {loading} disabled={disabled} htmlType="submit" type="primary">
            Gửi
          </Button>
        </Form.Item>
      </Form>
      <div className="chatbox">
        <ul className="chat-list">
          {messages.map((chat, index) => {
            const postDate = moment(chat.createdAt);
            return (
              <li key={index}>
                <em>{postDate.format("HH:mm DD/MM/YYYY")}</em>
                <strong>{_.get(chat, "sender.username", "unknown")}:</strong>
                {chat.message}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default Chatbox;
