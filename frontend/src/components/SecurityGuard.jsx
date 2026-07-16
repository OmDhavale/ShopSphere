"use client";

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getOrCreateSessionId } from '@/lib/sessionId';

export default function SecurityGuard({ children }) {
  // We need state to control the UI layer
  const [securityState, setSecurityState] = useState('SAFE'); // 'SAFE', 'CAPTCHA', or 'BLOCKED'

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 1. Connect to our Sidecar on port 3001
    const socket = io('http://localhost:3001');

    // 2. Listen for the alert from Python -> Kafka -> Node -> React
    socket.on('security-action', (data) => {
      const currentSessionId = getOrCreateSessionId();
      // Make sure this alert is actually for THIS user
      if (data.sessionId === currentSessionId) {
        if (data.action === 'TRIGGER_CAPTCHA') {
          setSecurityState('CAPTCHA');
        } else if (data.action === 'BLOCK_USER') {
          setSecurityState('BLOCKED');
        }
      }
    });

    // Cleanup connection when they leave
    return () => socket.disconnect();
  }, []);

  const handleCaptchaSuccess = () => {
    setSecurityState('SAFE');
  };

  // 3. The UI Rendering
  if (securityState === 'BLOCKED') {
    return (
      <div className="h-screen w-full bg-red-600 flex items-center justify-center text-white text-3xl font-bold">
        ACCESS DENIED - BOT DETECTED
      </div>
    );
  }

  return (
    <>
      {/* Your normal website content goes here */}
      {children}

      {/* Overlay the CAPTCHA if they are in the Yellow Zone */}
      {securityState === 'CAPTCHA' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded text-black">
            <h2>Suspicious Activity Detected</h2>
            <button
              onClick={handleCaptchaSuccess}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              I am Human (Simulate Puzzle Solve)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
