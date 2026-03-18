# 🌍 Blocky: Secure Charity Ledger

A decentralized, transparent, and cryptographically secure blockchain application designed to track charity donations. This project ensures total financial transparency through an immutable distributed ledger, RSA-signed transactions, and a Peer-to-Peer (P2P) consensus network.

---

## ✨ Exhaustive Feature List

This system implements a full-stack decentralized network from scratch, bridging low-level cryptographic engineering with a modern, responsive frontend.

### 🔐 1. Cryptography & Security
* **Asymmetric Keys:** Utilizes **RSA-2048** key pairs to establish verifiable digital identities for donors.
* **Digital Signatures:** Implements **PKCS#1 v1.5** signatures. Transactions cannot be forged, modified, or submitted without the sender's private key.
* **Data Integrity:** Every block is mathematically sealed using **SHA-256** hashing. Altering a single byte in a past transaction completely invalidates the current hash and breaks the chain.

### 🌐 2. Peer-to-Peer (P2P) Architecture
* **Bi-directional Handshake Protocol:** When a new node joins the network via a seed node, it automatically registers itself backward to the seed, ensuring two-way communication without manual configuration.
* **Network Synchronization:** Nodes can poll their registered peers to fetch the latest state of the blockchain.
* **RAM Persistence:** Designed for ephemeral deployment. If a node restarts, it automatically queries its peers on startup to download and rebuild the blockchain state into memory.

### ⚖️ 3. Decentralized Consensus
* **Proof of Work (PoW):** Requires nodes to solve a cryptographic puzzle (finding a hash with leading zeros) before a new block is minted, preventing spam and network abuse.
* **Nakamoto Consensus:** Implements the **Longest Chain Rule**. If there is a conflict in the network, nodes will drop their local chain and adopt the longest valid chain provided by their peers.

### 💻 4. Modern User Interface
* **Real-Time Polling:** The React dashboard automatically fetches the latest blockchain state every 3 seconds.
* **Multi-Node Selector:** Users can seamlessly toggle between different active nodes (e.g., Port 5000 vs. 5001) in the UI to visualize decentralized state and verify consensus.
* **Responsive Grid Layout:** Built with a flexible CSS grid and fluid typography that scales perfectly across desktop and mobile devices.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Backend API** | Python, Flask, Flask-CORS, Requests |
| **Frontend UI** | React, Vite, Axios, Lucide-React |
| **Cryptography** | PyCryptodome (RSA, SHA-256) |

---

## 🏗️ System Architecture

1. **The Wallet (`wallet.py` & `transaction.py`):** Generates PEM-formatted RSA key pairs and produces digital signatures for donation metadata (Sender, Recipient, Amount).
2. **The Node (`node.py` & `blockchain.py`):** The Flask server that manages the internal ledger, validates Proof-of-Work, routes transactions, and handles P2P gossip.
3. **The Dashboard (`App.jsx`):** A "Network-Aware" visualization tool that allows users to interact with the blockchain, trigger mining, and resolve consensus manually.

---

## 🔌 Core API Endpoints

* `GET /chain`: Returns the full blockchain and its length.
* `GET /mine`: Calculates the PoW, rewards the miner, and forges a new block.
* `POST /transactions/new`: Accepts a signed transaction, verifies the RSA signature, and adds it to the pending pool.
* `POST /nodes/register`: Accepts a list of peer node URLs and adds them to the network registry.
* `GET /nodes/resolve`: Triggers the consensus algorithm to check peers and replace the chain if a longer, valid one is found.

---

## 🏁 Getting Started

### 1. Prerequisites
Ensure you have Python 3.x and Node.js installed on your machine.
```bash
Install backend dependencies
pip install flask flask-cors requests pycryptodome
```

### 2. Launch the Blockchain Network
Open two separate terminals to simulate a decentralized network:
```bash
# Terminal 1: Primary Node (Anchor)
python backend/node.py -p 5000

# Terminal 2: Secondary Node (Syncs automatically with 5000)
python backend/node.py -p 5001 -s [http://127.0.0.1:5000](http://127.0.0.1:5000)
```

### 3. Launch the Frontend Dashboard
Open a third terminal for the UI:
```bash
cd frontend
npm install
npm run dev
```
Navigate to the provided localhost URL (usually http://localhost:5173) in your browser to view the dashboard.

## 🛡️ Security Implementation
To prevent unauthorized transactions, the Transaction class performs a strict verification:
Imports the PEM-formatted Public Key.
Reconstructs the Canonical JSON of the transaction data.
Verifies the PKCS1_15 signature against the SHA-256 hash of that data.
