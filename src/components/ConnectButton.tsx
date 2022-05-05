import { useEffect } from "react";
import { Button, message } from "antd";

function ConnectButton({ setAccount }) {
  // Check function if MetaMask is installed
  const isMetaMaskInstalled = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  useEffect(() => {
    handleOnClick();
  }, []);

  const handleOnClick = async () => {
    if (isMetaMaskInstalled()) {
      // Request to connect to MetaMask
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // Update the state for account
        setAccount(accounts[0]);
      } catch (error) {
        message.error(error.message);
      }
    } else {
      message.error("Please install MetaMask.");
    }
  };

  return (
    <Button className="connectButton" onClick={handleOnClick}>
      Connect wallet
    </Button>
  );
}

export default ConnectButton;
