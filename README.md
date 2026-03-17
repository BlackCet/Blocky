# 🌍 Secure Charity Ledger (Blocky)

A decentralized, transparent, and cryptographically secure blockchain application designed for charity donation tracking. This project ensures total financial transparency through an immutable distributed ledger and RSA-signed transactions.



## 🚀 Technical Features

This system implements a full-stack decentralized network with the following core engineering principles:

* **Asymmetric Cryptography:** Uses **RSA-2048** digital signatures (PKCS#1 v1.5) to ensure non-repudiation. No transaction can be forged without the sender's private key.
* **Nakamoto Consensus:** Implements the **Longest Chain Rule** to resolve network conflicts. Nodes automatically identify and synchronize with the most "difficult" valid chain.
* **P2P Networking:** Features a **Bi-directional Handshake** protocol. When a new node joins via a seed, it automatically registers itself with the peer, enabling two-way synchronization.
* **Data Integrity:** Blocks are linked via **SHA-256** hashing. Any tampering with historical transaction data invalidates the entire subsequent chain.
* **Responsive Dashboard:** A modern **Vite + React** frontend that allows real-time monitoring of multiple nodes and manual triggering of the mining process.



---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Python, Flask, Flask-CORS |
| **Frontend** | React (Vite), Axios, Lucide-React |
| **Security** | PyCryptodome (RSA-2048, SHA-256) |
| **Dev Tools** | Postman, Git, PowerShell |

---

## 🏗️ Architecture & Logic

The system is split into three primary modules:

1.  **The Wallet:** Generates PEM-formatted RSA key pairs and produces digital signatures for donation metadata (Amount, Recipient, Sender).
2.  **The Blockchain Engine:** Manages the internal RAM-based ledger, validates Proof-of-Work (PoW), and handles Peer-to-Peer gossip.
3.  **The UI:** A "Network-Aware" dashboard. Users can toggle between different ports (5000, 5001) to verify that the decentralized consensus is holding across all nodes.

---

## 🏁 Getting Started

### 1. Prerequisites
Ensure you have Python 3.x and Node.js installed.
```bash
pip install flask flask-cors requests pycryptodome
