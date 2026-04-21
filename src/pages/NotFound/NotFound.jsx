import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '"Open Sans", sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={{
          fontSize: '120px',
          fontWeight: '900',
          margin: '0',
          background: 'linear-gradient(to right, #2563eb, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1'
        }}>404</h1>
        
        <h2 style={{
          fontSize: '32px',
          color: '#1e293b',
          margin: '10px 0 20px'
        }}>Page Not Found</h2>
        
        <p style={{
          color: '#64748b',
          maxWidth: '500px',
          fontSize: '18px',
          marginBottom: '40px'
        }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: 'white',
              color: '#1e293b',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={18} /> Go Back
          </button>
          
          <button 
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: '#2563eb',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
          >
            <Home size={18} /> Back Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
