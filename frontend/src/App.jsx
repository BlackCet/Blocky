import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Zap, RefreshCw, Server } from 'lucide-react';

function App() {
  const [port, setPort] = useState(5000);
  const [chain, setChain] = useState([]);
  const [error, setError] = useState(null);

  const API_BASE = `http://127.0.0.1:${port}`;

  const fetchChain = async () => {
    try {
      const response = await axios.get(`${API_BASE}/chain`);
      // Sort to show newest blocks at the top
      setChain(response.data.chain.sort((a, b) => b.index - a.index));
      setError(null);
    } catch (err) {
      setError(`Node on port ${port} is offline.`);
      setChain([]);
    }
  };

  const mineBlock = async () => {
    try {
      await axios.get(`${API_BASE}/mine`);
      fetchChain();
    } catch (err) {
      alert("Mining failed.");
    }
  };

  const resolveConsensus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/nodes/resolve`);
      alert(res.data.message);
      fetchChain();
    } catch (err) {
      alert("Consensus check failed.");
    }
  };

 useEffect(() => {
    fetchChain();
    
   const interval = setInterval(() => {
      fetchChain();
    }, 3000);
    return () => clearInterval(interval);
  }, [port]);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={brandContainer}>
          <h1 style={titleStyle}>
            <ShieldCheck color="#3b82f6" size={window.innerWidth < 600 ? 24 : 32} /> 
            <span>Secure Charity Ledger</span>
          </h1>
          <div style={nodeSelectorContainer}>
            <Server size={14} color="#64748b" />
            <select 
              value={port} 
              onChange={(e) => setPort(e.target.value)}
              style={selectStyle}
            >
              <option value="5000">Node: 5000</option>
              <option value="5001">Node: 5001</option>
            </select>
          </div>
        </div>

        <div style={actionsContainer}>
          <button onClick={resolveConsensus} style={btnStyle('#6366f1')}>
            <RefreshCw size={16} /> <span>Sync</span>
          </button>
          <button onClick={mineBlock} style={btnStyle('#10b981')}>
            <Zap size={16} /> <span>Mine</span>
          </button>
        </div>
      </header>

      {error && <div style={errorBanner}>{error}</div>}

      <div style={gridStyle}>
        {chain.map((block) => (
          <div key={block.index} style={cardStyle}>
            <div style={cardHeader}>
              <span style={blockIndex}>BLOCK #{block.index}</span>
              <span style={timestampStyle}>
                {new Date(block.timestamp * 1000).toLocaleTimeString()}
              </span>
            </div>
            
            <div style={labelStyle}>Previous Hash</div>
            <div style={hashBox}>{block.previous_hash}</div>

            <div style={{ marginTop: '1rem' }}>
              <div style={labelStyle}>Transactions ({block.transactions.length})</div>
              <div style={txList}>
                {block.transactions.map((tx, i) => (
                  <div key={i} style={txItem}>
                    <span style={{color: '#10b981', fontWeight: 'bold'}}>₹{tx.amount}</span>
                    <span style={addressStyle}>{tx.recipient.substring(0, 12)}...</span>
                  </div>
                ))}
                {block.transactions.length === 0 && (
                  <div style={emptyTx}>No transactions in this block</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Responsive Styles ---

const containerStyle = {
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  padding: 'clamp(1rem, 5vw, 2rem)', // Responsive padding
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
};

const headerStyle = {
  display: 'flex',
  flexDirection: window.innerWidth < 768 ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: window.innerWidth < 768 ? 'flex-start' : 'center',
  gap: '1rem',
  marginBottom: '2rem'
};

const brandContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const titleStyle = {
  margin: 0,
  color: '#1e293b',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: 'clamp(1.2rem, 4vw, 1.8rem)'
};

const actionsContainer = {
  display: 'flex',
  gap: '10px',
  width: window.innerWidth < 768 ? '100%' : 'auto'
};

const nodeSelectorContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#fff',
  padding: '4px 12px',
  borderRadius: '20px',
  border: '1px solid #e2e8f0',
  width: 'fit-content'
};

const selectStyle = {
  border: 'none',
  background: 'transparent',
  color: '#64748b',
  fontWeight: 'bold',
  cursor: 'pointer',
  outline: 'none',
  fontSize: '0.85rem'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
  gap: '1.25rem'
};

const cardStyle = {
  backgroundColor: 'white',
  padding: '1.25rem',
  borderRadius: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column'
};

const btnStyle = (bg) => ({
  backgroundColor: bg,
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontWeight: 'bold',
  flex: window.innerWidth < 768 ? 1 : 'none',
  transition: 'transform 0.1s ease',
  fontSize: '0.9rem'
});

const cardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem'
};

const blockIndex = { fontWeight: '800', color: '#3b82f6', letterSpacing: '0.025em' };
const timestampStyle = { fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' };
const labelStyle = { fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.05em' };
const hashBox = { backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px', fontSize: '0.7rem', fontFamily: 'monospace', color: '#475569', wordBreak: 'break-all', lineHeight: '1.4' };
const errorBanner = { padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: '500', textAlign: 'center', border: '1px solid #fecaca' };

const txList = { marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '8px' };
const txItem = { display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem' };
const addressStyle = { color: '#64748b', fontFamily: 'monospace' };
const emptyTx = { fontSize: '0.8rem', color: '#cbd5e1', fontStyle: 'italic', textAlign: 'center', padding: '10px' };

export default App;