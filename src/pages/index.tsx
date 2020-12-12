import Chat from "../components/Chat"
import Home from "../components/chats/Home"
import { Divider } from 'antd';

function IndexPage() {
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
      <Home/>
    </div>
  );
}

export default IndexPage;
