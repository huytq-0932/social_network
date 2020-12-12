import { Form, Input, Button, Checkbox } from 'antd';
import allService from "@src/services/allService";
import auth from "@src/utils/auth"
import to from "await-to-js";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 14 },
};

const Demo = () => {
  const onFinish = async values => {
    let [error, user = {token: ""}] =  await to(allService().login(values));
    if(error) {
        alert("Đăng nhập lỗi!");
        return;
    }
    let token = user.token;
    auth().setAuth({user, token});
    location.reload();
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Điện thoại"
        name="phonenumber"
        rules={[{ required: true, message: 'Please input your phone number!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Demo;