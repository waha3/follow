import { useState } from "react";
import "./styles.css";
import ConnectButton from "./components/ConnectButton";
import {
  FollowButton,
  Env,
  Blockchain
} from "@cyberconnect/react-follow-button";
import { Form, Input, Button, Space, List } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "antd/dist/antd.min.css";

export default function App() {
  const [account, setAccount] = useState<string>("");
  const [addressList, setAddressList] = useState<string[]>([]);
  const onFinish = (values: { list: { address: string }[] }) => {
    console.log(values);
    setAddressList(values.list.map((val) => val.address));
  };

  console.log(addressList);

  return (
    <div className="container">
      <h1>Connect with Follow Button</h1>
      <ConnectButton setAccount={setAccount}></ConnectButton>

      {/* <textarea
        className="textarea-class"
        id="text"
      /> */}
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        style={{
          marginTop: 10
        }}
      >
        <Form.List name="list">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: "flex" }} align="baseline">
                  <Form.Item
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
                  Add Address
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
      <List header="follow">
        {addressList.map((address, index) => (
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
              />
            ]}
          >
            {address}
          </List.Item>
        ))}
      </List>
    </div>
  );
}
