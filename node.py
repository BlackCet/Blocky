import requests # Added to handle the back-registration
from flask import Flask, jsonify, request
from flask_cors import CORS 
from blockchain import Blockchain
from uuid import uuid4
from argparse import ArgumentParser

app = Flask(__name__)
CORS(app) 

node_identifier = str(uuid4()).replace('-', '')
blockchain = Blockchain()

@app.route('/mine', methods=['GET'])
def mine():
    last_block = blockchain.last_block()
    proof = blockchain.proof_of_work(last_block['proof'])
    blockchain.pending_transactions.append({
        'sender': "0",
        'recipient': node_identifier,
        'amount': 1,
        'message': 'Mining Reward'
    })
    block = blockchain.create_block(proof, blockchain.hash(last_block))
    return jsonify(block), 200

@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    values = request.get_json()
    required = ['sender', 'recipient', 'amount', 'signature']
    if not all(k in values for k in required):
        return 'Missing values', 400
    index = blockchain.add_transaction(values['sender'], values['recipient'], 
                                       values['amount'], values['signature'])
    if index is False:
        return jsonify({'message': 'Invalid Signature!'}), 400
    return jsonify({'message': f'Transaction will be added to Block {index}'}), 201

@app.route('/chain', methods=['GET'])
def full_chain():
    return jsonify({'chain': blockchain.chain, 'length': len(blockchain.chain)}), 200

@app.route('/nodes/register', methods=['POST'])
def register_nodes():
    values = request.get_json()
    nodes = values.get('nodes')
    if not nodes:
        return "Invalid data", 400
    for node in nodes:
        blockchain.register_node(node)
    return jsonify({'message': 'Nodes added', 'total_nodes': list(blockchain.nodes)}), 201

@app.route('/nodes/resolve', methods=['GET'])
def consensus():
    replaced = blockchain.resolve_conflicts()
    msg = 'Chain replaced' if replaced else 'Our chain is authoritative'
    return jsonify({'message': msg, 'chain': blockchain.chain}), 200

if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int)
    parser.add_argument('-s', '--seed', default=None, type=str, help="Seed node URL")
    args = parser.parse_args()
    port = args.port

    if args.seed:
        # 1. Register the seed node on OUR list
        blockchain.register_node(args.seed)
        
        # 2. SMART HANDSHAKE: Tell the seed node that WE exist
        # This makes the connection bi-directional so Node 5000 can sync from 5001 later
        try:
            my_address = f"http://127.0.0.1:{port}"
            requests.post(f"{args.seed}/nodes/register", json={"nodes": [my_address]}, timeout=2)
            print(f"Handshake successful: Registered {my_address} at {args.seed}")
        except Exception as e:
            print(f"Handshake failed: {e}")

        # 3. Initial Sync
        blockchain.resolve_conflicts()

    app.run(host='0.0.0.0', port=port)