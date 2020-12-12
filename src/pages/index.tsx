import auth from "@src/utils/auth";
import Login from "@src/components/login";
import { Button, Input } from "antd";
import { useState, useEffect } from "react";
import { Divider } from "antd";
import _ from "lodash";
function IndexPage() {
  const [reload, setReload] = useState(false);
  const [loginUser, setLoginUser] = useState({});
  useEffect(() => {
    console.log("auth().token ", auth().token)
    setLoginUser(auth().user || {});
  }, []);
  return (
    <div>
      Cách chạy source: <br />
      B1: mở thư mục code lên, gõ yarn để cài đặt (Nhớ cái nodejs làm môi trường
      trước)
      <br />
      B2: <br />
      - Chạy front thì gõ lệnh: yarn run dev-client - Chạy backend thì gõ lệnh
      yarn run dev-server <br />
      B3: Dùng db tạo online sẵn config vào ENV <br />
      B4: dev :)))
      <br />
      Link api: https://luandz.cf/it4788 <br />
      File excel tiến độ dự án:{" "}
      <a href="http://bit.ly/it4788" target="_blank">
        http://bit.ly/it4788
      </a>
      <Divider />
      {auth().token ? (
        <div>
          <Button
            onClick={() => {
              auth().logout();
              setReload(!reload);
            }}
            type="primary"
          >
            Logout
          </Button>
          <div>Bạn đang login vào sdt: {_.get(auth(), "user.phonenumber", "")}</div>
          <div>Chat với người nào thì vào url:{" "}
          <b>/chats?phonenumber="NGUOI_MUON_CHAT"</b></div>
          <div>
            <p>tai khoan 1: phone: 0123456798 , pass: 123456</p>
            <p>tai khoan 2: phone: 0356315140 , pass: 123456</p>
            link chat 1{" "}
            <a href="/chats?phonenumber=0356315140" target="_blank">
              /chats?phonenumber=0356315140
            </a>
            link chat 2{" "}
            <a href="/chats?phonenumber=0123456798" target="_blank">
              /chats?phonenumber=0123456798
            </a>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default IndexPage;
