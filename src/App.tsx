import { useEffect, useState, useRef } from "react";
import "./styles.css";
import ConnectButton from "./components/ConnectButton";
import {
  FollowButton,
  Env,
  Blockchain,
} from "@cyberconnect/react-follow-button";
import { Form, Input, Button, Space, List, message, Row, Col } from "antd";
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

initializeApp(firebaseConfig);

export default function App() {
  const db = getDatabase();
  const [account, setAccount] = useState<string>("");
  const [addressList, setAddressList] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [batchBtnDisbled, setBatchBtnDisbled] = useState(true);

  const onFinish = (values: { list: { address: string }[] }) => {
    const list = values.list.map((val) => val.address);
    setAddressList(list);

    for (let i of list) {
      set(ref(db, "address_list/" + i), i);
    }
  };

  useEffect(() => {
    const qs = query(ref(db, "address_list/"), orderByKey());
    onValue(qs, (snapshot) => {
      const data = snapshot.val();
      const formatedData = Object.keys(data)
        .map((val) => ({
          random: Math.random(),
          address: val,
        }))
        .sort((a, b) => a.random - b.random)
        .map((val) => val.address);
      setAddressList(formatedData);
    });
  }, []);

  useEffect(() => {
    setBatchBtnDisbled(true);
    // batch follow
    let id = setInterval(() => {
      let dom = Array.from(
        document.querySelectorAll(".ant-list-item-action .buttonText-0-2-8")
      );
      let btnTextList = dom.map((item) => item.textContent);

      if (
        btnTextList.length === pageSize &&
        btnTextList.every(
          (text) =>
            text.toLowerCase() === "follow" ||
            text.toLowerCase() === "following"
        )
      ) {
        setBatchBtnDisbled(false);

        window.clearInterval(id);
      }
    }, 100);
    return () => {
      window.clearInterval(id);
    };
  }, [pageSize, currentPage]);

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleBatchFollow = () => {
    let dom = Array.from(
      document.querySelectorAll(".ant-list-item-action .buttonText-0-2-8")
    );

    for (let i of dom) {
      if (i.textContent.toLowerCase() === "follow") {
        let ele = i;
        ele.click();
      }
    }
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
        header={
          <Row justify="space-between">
            <Col>follow list</Col>
            <Col>
              <Button
                type="primary"
                disabled={batchBtnDisbled}
                onClick={handleBatchFollow}
              >
                batch follow
              </Button>
            </Col>
          </Row>
        }
        dataSource={addressList}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          onChange: handlePageChange,
        }}
        renderItem={(address, index) => (
          <List.Item
            key={address}
            actions={[
              <FollowButton
                key={address}
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
