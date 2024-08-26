import React, { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json';
import './CoinflipGame.css'; // Import the CSS file for styling

function CoinflipGame() {
  const [betAmount, setBetAmount] = useState("");
  const [selectedSide, setSelectedSide] = useState("heads");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState("");

  async function flipCoin() {
    try {
      if (typeof window.ethereum !== "undefined") {
        setLoading(true);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = provider.getSigner();

        if (!ethers.isAddress(contractAddress)) {
          setResult("Invalid contract address.");
          setLoading(false);
          return;
        }

        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const userGuess = selectedSide === "heads";

        const tx = await contract.flip(userGuess, { value: ethers.parseEther(betAmount) });
        await tx.wait();

        const txReceipt = await provider.getTransactionReceipt(tx.hash);
        if (txReceipt.status === 1) {
          const logs = txReceipt.logs;
          if (logs.length > 0) {
            const event = contract.interface.parseLog(logs[0]);
            const didWin = event.args[0];
            setResult(didWin ? "🎉 You won! 🎉" : "😞 You lost. Try again!");
          } else {
            setResult("No event logs found. Please check the smart contract.");
          }
        } else {
          setResult("Transaction failed!");
        }

        setLoading(false);
      } else {
        alert("Please install MetaMask to interact with this feature.");
      }
    } catch (error) {
      console.error("Error during the coinflip:", error);
      setResult("An error occurred. Check the console for details.");
      setLoading(false);
    }
  }

  return (
    <div className="coinflip-container-alt">
      
      <div className="coinflip-card">
        <div className="coinflip-input-group">
          <input
            type="text"
            className="coinflip-input-alt"
            placeholder="Contract address"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
        </div>
        <div className="coinflip-input-group">
          <input
            type="number"
            className="coinflip-input-alt"
            placeholder="Bet amount (ETH)"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
          />
        </div>
        <div className="coinflip-radio-group-alt">
          <label className={`coinflip-radio-alt ${selectedSide === "heads" ? "selected" : ""}`}>
            <input
              type="radio"
              value="heads"
              checked={selectedSide === "heads"}
              onChange={() => setSelectedSide("heads")}
            />
            Heads
          </label>
          <label className={`coinflip-radio-alt ${selectedSide === "tails" ? "selected" : ""}`}>
            <input
              type="radio"
              value="tails"
              checked={selectedSide === "tails"}
              onChange={() => setSelectedSide("tails")}
            />
            Tails
          </label>
        </div>
        <button className="coinflip-button-alt" onClick={flipCoin} disabled={loading}>
          {loading ? "Flipping..." : "Flip Coin"}
        </button>
        {result && <p className="coinflip-result-alt">{result}</p>}
      </div>
    </div>
  );
}

export default CoinflipGame;
