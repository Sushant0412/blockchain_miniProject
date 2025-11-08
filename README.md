# 🧾 MultiSig Wallet (Hardhat + React + AWS)

This project is a **Multi-Signature Wallet DApp** built using **Hardhat**, **Solidity**, and **React.js**. It allows multiple wallet owners to collectively approve and execute transactions securely — ideal for team or DAO treasury management.

## 🚀 Features

- Deployable smart contract with multiple wallet owners
- Submit, approve, revoke, and execute transactions
- View transaction history
- Connect via **MetaMask**
- Simple React frontend integrated with **Ethers.js**
- Deployable to **AWS S3 + CloudFront + HTTPS**

## 🧱 Project Structure

```plaintext
multisig-hardhat/
│
├── contracts/
│   └── MultiSigWallet.sol        # Smart contract
│
├── scripts/
│   └── deploy.js                 # Hardhat deployment script
│
├── frontend/
│   ├── src/
│   │   ├── App.js                # React frontend
│   │   ├── config.js             # Contract ABI + Address
│   │   └── index.js
│   └── package.json
│
├── test/                         # Optional unit tests
│
├── hardhat.config.js
├── .env
└── README.md
```

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies

npm install

If you have a frontend folder:

`cd frontend  npm install`

### 2️⃣ Configure Environment Variables

Create a .env file in the project root:

`PRIVATE_KEY=your_metamask_private_key `

`SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_api_key   `

Never share your private key publicly.

### 3️⃣ Compile the Contract

` npx hardhat compile `

### 4️⃣ Deploy to Sepolia Testnet

` npx hardhat run scripts/deploy.js --network sepolia `

After successful deployment, note the output:

` MultiSigWallet deployed to: 0xC8816414e5Aae4A6B6D958fE478678153F250EA0 `

Copy this address to frontend/src/config.js.

### 5️⃣ Run Frontend Locally

` cd frontend  npm start `

Then open [http://localhost:3000](http://localhost:3000/).

## 💻 Frontend Features

The frontend allows you to:

- **Connect MetaMask**
- **View wallet balance**
- **Submit new transactions**
- **Approve pending transactions**
- **View all transaction details**

## 🪙 Smart Contract Functions

### 🔹 `submit(address to, uint value, bytes data)`

Submits a new transaction for approval by wallet owners.

### 🔹 `approve(uint txId)`

Approves a pending transaction by a wallet owner.

### 🔹 `revoke(uint txId)`

Revokes a previously given approval for a transaction.

### 🔹 `execute(uint txId)`

Executes the transaction once the required number of approvals is reached.

### 🔹 `transactions(uint id)`

Returns details of a specific transaction such as recipient, value, data, approvals, and execution status.

### 🔹 `owners(uint index)`

Returns the address of an owner by index.

### 🔹 `isOwner(address addr)`

Checks whether a given address belongs to one of the wallet owners.

## 🌐 Deploying Frontend on AWS (S3 + CloudFront)

### 1️⃣ Build the React app

` cd frontend  npm run build `

### 2️⃣ Create an S3 Bucket

- Name it (e.g.) multisig-wallet-dapp
- Enable **Static Website Hosting**
- Upload everything from frontend/build/
- Set permissions to **public read access**

### 3️⃣ Create CloudFront Distribution

- Origin domain: your S3 bucket
- Default root object: index.html
- Enable HTTPS
- Copy the **CloudFront URL** (e.g., https://d3xyz.cloudfront.net)

### 4️⃣ (Optional) Add Custom Domain

- Buy a domain from **Route53**
- Create an **A record (alias)** pointing to the CloudFront distribution

## 📱 Optional Improvements

- Add **WalletConnect** for mobile wallet support
- Style frontend using **TailwindCSS or Bootstrap**
- Add **Execute Transaction** button for final multisig execution
- Add **Etherscan link** for each transaction hash
- Use **CloudFront invalidation** for faster updates after redeploy

## 🧠 Tech Stack

- **Smart Contract:** Solidity (Hardhat)
- **Blockchain:** Ethereum Sepolia Testnet
- **Frontend:** React + Ethers.js
- **Hosting:** AWS S3 + CloudFront
- **Wallet Integration:** MetaMask

## 🧩 Example Commands

Compile contract: `npx hardhat compile `

Deploy contract to Sepolia `npx hardhat run scripts/deploy.js --network sepolia `

Start local frontend `npm start  # Build production frontend  npm run build `

## 📜 License

This project is licensed under the **MIT License**.
