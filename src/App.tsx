import { useEffect, useState } from "react";
import "./styles.css";
import ConnectButton from "./components/ConnectButton";
import {
  FollowButton,
  Env,
  Blockchain,
} from "@cyberconnect/react-follow-button";
import { Form, Input, Button, Space, List, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  query,
  startAt,
  limitToFirst,
  limitToLast,
  endAt,
  orderByKey,
} from "firebase/database";

import "antd/dist/antd.min.css";

const firebaseConfig = {
  apiKey: "AIzaSyB7U2BxIp7VdA0nLrsuxxfUF6ybNTvTxO8",
  authDomain: "wechat-follow.firebaseapp.com",
  projectId: "wechat-follow",
  storageBucket: "wechat-follow.appspot.com",
  messagingSenderId: "1006898251801",
  appId: "1:1006898251801:web:c20393888d3d40a8588288",
  measurementId: "G-QCZGJCSHVG",
  databaseURL: "https://wechat-follow-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);

export default function App() {
  const db = getDatabase();
  const [account, setAccount] = useState<string>("");
  const [addressList, setAddressList] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const onFinish = (values: { list: { address: string }[] }) => {
    const list = values.list.map((val) => val.address);
    setAddressList(list);

    for (let i of list) {
      set(ref(db, "address_list/" + i), i);
    }
  };

  useEffect(() => {
    const qs = query(
      ref(db, "address_list/"),
      orderByKey()
      // limitToFirst((currentPage - 1) * pageSize + 1),
      // limitToLast(currentPage * pageSize)
    );

    // onValue(ref(db, "address_list/"), (snapshot) => {
    //   const data = snapshot.val();
    //   const formatedData = Object.keys(data);
    //   setAddressList(formatedData);
    // });

    onValue(qs, (snapshot) => {
      const data = snapshot.val();
      const formatedData = Object.keys(data);
      setAddressList(formatedData);
    });
  }, [pageSize, currentPage]);

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
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
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          onChange: handlePageChange,
        }}
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
                  message.success(e.code);
                }}
                onFailure={(e) => {
                  message.error(e.code + "  " + e.message);
                }}
              />,
            ]}
          >
            {address}
          </List.Item>
        )}
      />
    </div>
  );
}
