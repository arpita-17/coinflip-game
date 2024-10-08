import React from 'react';
import WalletConnect from './components/WalletConnect';
import CoinflipGame from './components/CoinflipGame';
import './App.css'; // Add any custom styling here

function App() {
  return (
    <div className="App">
      <h1>Coinflip Game</h1>
      <div>
      <WalletConnect />
      <CoinflipGame />
      </div>
    </div>
  );
}

export default App;
