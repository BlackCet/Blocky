from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
import binascii
import json
from collections import OrderedDict

class Transaction:
    def __init__(self, sender_public_key, recipient, amount, signature):
        self.sender_public_key = sender_public_key
        self.recipient = recipient
        self.amount = amount
        self.signature = signature

    def to_ordered_dict(self):
        # The key names here MUST match your wallet's signing script exactly
        return OrderedDict([
            ('sender_public_key', self.sender_public_key),
            ('recipient', self.recipient),
            ('amount', self.amount)
        ])

    def verify_transaction_signature(self):
        try:
            # Clean and import the RSA Public Key
            public_key = RSA.import_key(self.sender_public_key.strip())
            verifier = pkcs1_15.new(public_key)
            
            # Canonical string representation (JSON)
            data_string = json.dumps(self.to_ordered_dict(), sort_keys=True)
            h = SHA256.new(data_string.encode('utf-8'))
            
            # Verify signature against the hash
            verifier.verify(h, binascii.unhexlify(self.signature))
            return True
        except (ValueError, TypeError, binascii.Error) as e:
            print(f"Verification Failed: {e}")
            return False