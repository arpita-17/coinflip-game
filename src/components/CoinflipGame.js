//0xA0843663a66Bb906538A24ECdf3aE2Dfb021272B
import React, { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json'; // Adjust the path to your ABI file

function CoinflipGame() {
  const [betAmount, setBetAmount] = useState("");
  const [selectedSide, setSelectedSide] = useState("heads");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState(""); // New state for user-defined contract address

  async function flipCoin() {
    try {
      if (typeof window.ethereum !== "undefined") {
        setLoading(true);

        // Connect to MetaMask
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = provider.getSigner();
        
        // Validate the contract address
        if (!ethers.isAddress(contractAddress)) {
          setResult("Invalid contract address.");
          setLoading(false);
          return;
        }

        // Create a contract instance with user-defined address
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Determine user's guess
        const userGuess = selectedSide === "heads";

        // Send the transaction to the contract with the bet amount
        const tx = await contract.flip(userGuess, { value: ethers.parseEther(betAmount) });
        await tx.wait(); // Wait for the transaction to be mined

        // Fetch the result of the flip
        const txReceipt = await provider.getTransactionReceipt(tx.hash);
        if (txReceipt.status === 1) { // 1 means the transaction was successful
          const logs = txReceipt.logs;
          if (logs.length > 0) {
            const event = contract.interface.parseLog(logs[0]);
            const didWin = event.args[0];
            setResult(didWin ? "You won!" : "You lost. Try again!");
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
    <div>
      <h2>Coinflip Game</h2>
      <div>
        <input
          type="text"
          placeholder="Enter contract address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
      </div>
      <div>
        <input
          type="number"
          placeholder="Enter bet amount in ETH"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
        />
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="heads"
            checked={selectedSide === "heads"}
            onChange={() => setSelectedSide("heads")}
          />
          Heads
        </label>
        <label>
          <input
            type="radio"
            value="tails"
            checked={selectedSide === "tails"}
            onChange={() => setSelectedSide("tails")}
          />
          Tails
        </label>
      </div>
      <button onClick={flipCoin} disabled={loading}>
        {loading ? "Flipping..." : "Flip Coin"}
      </button>
      {result && <p>{result}</p>}
    </div>
  );
}

export default CoinflipGame;
