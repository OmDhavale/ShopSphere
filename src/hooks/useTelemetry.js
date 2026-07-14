"use client";

import { useEffect, useRef } from 'react';

// Helper function for Session Management
const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') return ''; // Safety check for SSR

  let sessionId = sessionStorage.getItem('clickstream_session_id');
  if (!sessionId) {
    // Generate a new UUID if none exists
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('clickstream_session_id', sessionId);
  }
  return sessionId;
};

export const useTelemetry = () => {
  // Buffer to hold events before flushing
  const eventBuffer = useRef([]);

  // Refs to keep track of mouse state for velocity calculation
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const lastMouseTimeThrottled = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sessionId = getOrCreateSessionId();

    // -- Event Handlers --

    const handleMouseMove = (e) => {
      const now = Date.now();
      // Throttle mouse movements to sample once every 50ms
      if (now - lastMouseTimeThrottled.current < 50) return;
      lastMouseTimeThrottled.current = now;

      // Calculate velocity (pixels per millisecond)
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dt = now - lastMousePos.current.time || 1; // prevent divide by zero
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = distance / dt;

      // Update last mouse position
      lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };

      eventBuffer.current.push({
        type: 'mouse_move',
        x: e.clientX,
        y: e.clientY,
        velocity: velocity,
        timestamp: now
      });
    };

    const handleClick = (e) => {
      eventBuffer.current.push({
        type: 'click',
        x: e.clientX,
        y: e.clientY,
        targetTag: e.target?.tagName?.toLowerCase() || 'unknown',
        timestamp: Date.now()
      });
    };

    const handleScroll = () => {
      eventBuffer.current.push({
        type: 'scroll',
        depth: window.scrollY,
        timestamp: Date.now()
      });
    };

    // -- Attach Listeners --
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // -- Flush Mechanism --
    const flushInterval = setInterval(() => {
      if (eventBuffer.current.length > 0) {
        // Format the payload exactly to schema
        const payload = {
          sessionId: sessionId,
          userId: "guest_user", // Default for now
          events: [...eventBuffer.current]
        };

        // Log the payload to verify the schema
        //console.log(JSON.stringify(payload, null, 2));

        // TODO: Insert fetch POST request to API gateway here later
        fetch('/api/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        // Clear the buffer for the next 3 seconds
        eventBuffer.current = [];
      }
    }, 3000);

    // -- Cleanup on Unmount --
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(flushInterval);
    };
  }, []);
};
