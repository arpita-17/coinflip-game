import React, { useState } from 'react';
import { ethers } from 'ethers';

function WalletConnect() {
  const [account, setAccount] = useState(null);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.");
    }
  }

  return (
    <div>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
      </button>
    </div>
  );
}

export default WalletConnect;
