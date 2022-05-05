import { useState } from "react";
import "./styles.css";
import ConnectButton from "./components/ConnectButton";
import {
  FollowButton,
  Env,
  Blockchain,
} from "@cyberconnect/react-follow-button";
import { Form, Input, Button, Space, List } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "antd/dist/antd.min.css";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7U2BxIp7VdA0nLrsuxxfUF6ybNTvTxO8",
  authDomain: "wechat-follow.firebaseapp.com",
  projectId: "wechat-follow",
  storageBucket: "wechat-follow.appspot.com",
  messagingSenderId: "1006898251801",
  appId: "1:1006898251801:web:c20393888d3d40a8588288",
  measurementId: "G-QCZGJCSHVG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default function App() {
  const [account, setAccount] = useState<string>("");
  const [addressList, setAddressList] = useState<string[]>([]);
  const onFinish = (values: { list: { address: string }[] }) => {
    setAddressList(values.list.map((val) => val.address));
  };

  return (
    <div className="container">
      {account ? (
        <Button
          style={{
            width: "auto",
          }}
        >
          {account}
        </Button>
      ) : (
        <>
          <h1>Connect with Follow Button</h1>
          <ConnectButton setAccount={setAccount}></ConnectButton>
        </>
      )}
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        style={{
          marginTop: 10,
          width: 800,
        }}
      >
        <Form.List name="list">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: "flex" }} align="baseline">
                  <Form.Item
                    style={{
                      width: 800,
                    }}
                    {...restField}
                    name={[name, "address"]}
                    rules={[{ required: true, message: "Missing address" }]}
                  >
                    <Input placeholder="wallet address" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Wallet Address
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <List
        style={{
          width: 800,
        }}
        header="follow list"
        dataSource={addressList}
        renderItem={(address, index) => (
          <List.Item
            key={index}
            actions={[
              <FollowButton
                provider={window.ethereum}
                namespace="CyberConnect"
                toAddr={address}
                env={Env.PRODUCTION}
                chain={Blockchain.ETH}
                onSuccess={(e) => {
                  console.log(e);
                }}
                onFailure={(e) => {
                  console.log(e);
                }}
              />,
            ]}
          >
            {address}
          </List.Item>
        )}
      ></List>
    </div>
  );
}
