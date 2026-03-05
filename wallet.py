from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
import binascii
import json
from collections import OrderedDict

class Wallet:
    def __init__(self):
        self.private_key = RSA.generate(2048)
        self.public_key = self.private_key.publickey()

    def get_private_key(self):
        return self.private_key.export_key().decode('utf-8')

    def get_public_key(self):
        return self.public_key.export_key().decode('utf-8')

    @staticmethod
    def sign_transaction(private_key, data):
        key = RSA.import_key(private_key)
        h = SHA256.new(data.encode('utf-8'))
        signature = pkcs1_15.new(key).sign(h)
        return binascii.hexlify(signature).decode('ascii')

if __name__ == "__main__":
    w = Wallet()
    pub = w.get_public_key()
    
    # Create the data exactly how Transaction.to_ordered_dict expects it
    test_data = OrderedDict([
        ('sender_public_key', pub),
        ('recipient', 'Charity_Fund'),
        ('amount', 500)
    ])
    
    data_to_sign = json.dumps(test_data, sort_keys=True)
    sig = w.sign_transaction(w.get_private_key(), data_to_sign)
    
    # Generate the exact JSON for Postman
    postman_payload = {
        "sender": pub,
        "recipient": "Charity_Fund",
        "amount": 500,
        "signature": sig
    }
    
    print("--- PASTE THIS ENTIRE JSON INTO POSTMAN BODY ---")
    print(json.dumps(postman_payload, indent=4))