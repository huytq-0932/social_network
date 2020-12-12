import auth from "@src/utils/auth";
import Login from "@src/components/login";
import { Button, Input } from "antd";
import { useState } from "react";
import { Divider } from "antd";

function IndexPage() {
  const [reload, setReload] = useState(false);
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
        Chat với người nào thì vào url: <b>/chats?phonenumber="NGUOI_MUON_CHAT"</b>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default IndexPage;
