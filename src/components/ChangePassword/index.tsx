import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
interface ModelFormProps {
  onChangePassword: any;
  onCancel: () => void;
  visible: boolean;
}

const ChangePasswordModel: React.FC<ModelFormProps> = ({ onChangePassword, visible, onCancel }) => {

  const [form] = Form.useForm();
  const { t } = useBaseHook();

  //validate input password
  const validatorPassword = ({
    getFieldValue
  }: {
    getFieldValue: Function;
  }) => ({
    validator: (rule: any, value: any) => {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(t("form.rePassword"));
    }
  });

  return (
    <Form
      form={form}
      name="form"
      initialValues={{
        password: "",
        repassword: ""
      }}
      onFinish={onChangePassword}
    >
      <Modal
        closable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={() => {
          form.submit();
        }}
      >
        <Form.Item
          label={t("password")}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          name="password"
          rules={[{ required: true, message: t("form.required") }]}
        >
          <Input.Password
            placeholder={t("password")}
            type="password"
            autoFocus={true}
          />
        </Form.Item>
        <Form.Item
          label={t("rePassword")}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          name="repassword"
          rules={[
            { required: true, message: t("form.required") },
            validatorPassword
          ]}
        >
          <Input.Password placeholder={t("rePassword")} />
        </Form.Item>
      </Modal>
    </Form>
  );
};

export default ChangePasswordModel;
