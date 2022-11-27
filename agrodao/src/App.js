import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

const greetAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {

  const [message, setMessage] = useState("");

  async function requestAccount() {
    await window.ethereum.request( {method: 'eth_requestAccounts'} );
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greetAddress, Greeter.abi, provider)
    
      try {
        const data = await contract.greet();
        console.log("data: ", data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  async function setGreeting() {
    if (!message) return;

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(greetAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(message);
      setMessage("");
      await transaction.wait();
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button onClick={fetchGreeting}> Fetch greet </button>
          <button onClick={setGreeting}> Set greet</button>
          <input
            placeholder="set lock message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}>
          </input>
        </div>
      </header>
    </div>
  );
}

export default App;
