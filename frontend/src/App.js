import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./config";

function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [txs, setTxs] = useState([]);
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [txId, setTxId] = useState("");
  const [executeTxId, setExecuteTxId] = useState("");
  const [required, setRequired] = useState(0); // Stores the required approval count

  // Connect MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      // If not Sepolia (0xaa36a7 = 11155111)
      if (chainId !== "0xaa36a7") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      getBalance(accounts[0]);
      getRequiredCount(); // Fetch the required count on connect
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Fetch wallet balance
  const getBalance = async (addr) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const bal = await provider.getBalance(addr);
    setBalance(ethers.formatEther(bal));
  };

  // Fetch the required number of approvals
  const getRequiredCount = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );
      const reqCount = await contract.required();
      setRequired(Number(reqCount));
    } catch (err) {
      console.error("Error fetching required count:", err);
    }
  };

  // Fetch transactions from contract
  const getTransactions = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      // if you have a transaction count variable in your contract
      let count;
      try {
        count = await contract.transactionCount(); // Assumes a function `transactionCount()`
      } catch {
        // Fallback: iterate until revert
        count = 0;
        while (true) {
          try {
            await contract.transactions(count);
            count++;
          } catch {
            break;
          }
        }
      }

      const txList = [];
      for (let i = 0; i < Number(count); i++) {
        const tx = await contract.transactions(i);
        // Fetch approval count for each transaction
        const approvals = await contract._getApprovalCount(i);

        txList.push({
          id: i,
          to: tx.to,
          value: ethers.formatEther(tx.value),
          executed: tx.executed,
          approvals: Number(approvals), // Add approval count to the object
        });
      }

      setTxs(txList);
    } catch (err) {
      console.error(err);
      alert("Error fetching transactions");
    }
  };

  // Submit new transaction
  const submitTransaction = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.submit(to, ethers.parseEther(value), "0x");
      await tx.wait();
      alert("Transaction submitted!");
      getTransactions();
    } catch (err) {
      console.error(err);
      alert("Error submitting transaction");
    }
  };

  // Approve transaction by ID
  const approveTransaction = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.approve(txId);
      await tx.wait();
      alert("Transaction approved!");
      getTransactions();
    } catch (err) {
      console.error(err);
      alert("Error approving transaction");
    }
  };

  // Execute transaction by ID
  const executeTransaction = async () => {
    if (!executeTxId) {
      alert("Please enter a Transaction ID");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.execute(executeTxId);
      await tx.wait();
      alert("Transaction executed!");
      getTransactions(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert(
        "Error executing transaction. Are you sure it has enough approvals?"
      );
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "40px",
        fontFamily: "sans-serif",
      }}
    >
      <h2>💰 MultiSig Wallet - Sepolia</h2>

      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <>
          <p>
            <b>Connected:</b> {account}
          </p>
          <p>
            <b>Balance:</b> {balance} ETH
          </p>
          {required > 0 && (
            <p>
              <b>Confirmations Required:</b> {required}
            </p>
          )}

          <hr style={{ margin: "20px 0" }} />

          <h3>📝 Submit New Transaction</h3>
          <input
            type="text"
            placeholder="Recipient address"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{ width: "300px", padding: "8px", marginRight: "8px" }}
          />
          <input
            type="text"
            placeholder="Amount (ETH)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ width: "120px", padding: "8px", marginRight: "8px" }}
          />
          <button onClick={submitTransaction}>Submit</button>

          <hr style={{ margin: "20px 0" }} />

          <h3>✅ Approve Transaction</h3>
          <input
            type="number"
            placeholder="Transaction ID"
            value={txId}
            onChange={(e) => setTxId(e.target.value)}
            style={{ width: "150px", padding: "8px", marginRight: "8px" }}
          />
          <button onClick={approveTransaction}>Approve</button>

          <hr style={{ margin: "20px 0" }} />

          <h3>🚀 Execute Transaction</h3>
          <input
            type="number"
            placeholder="Transaction ID"
            value={executeTxId}
            onChange={(e) => setExecuteTxId(e.target.value)}
            style={{ width: "150px", padding: "8px", marginRight: "8px" }}
          />
          <button onClick={executeTransaction}>Execute</button>

          <hr style={{ margin: "20px 0" }} />

          <h3>📜 Transactions</h3>
          <button onClick={getTransactions}>Show Transactions</button>

          {txs.length > 0 ? (
            <ul
              style={{
                textAlign: "left",
                marginTop: "20px",
                display: "inline-block",
                listStyleType: "none",
                padding: 0,
              }}
            >
              {txs.map((tx) => (
                <li
                  key={tx.id}
                  style={{
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <b>ID:</b> {tx.id} |<b> To:</b> {tx.to} |<b> Value:</b>{" "}
                  {tx.value} ETH |
                  <b>
                    {" "}
                    Approvals: {tx.approvals} / {required}
                  </b>{" "}
                  |<b> Executed:</b> {tx.executed ? "✅" : "❌"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions found.</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
