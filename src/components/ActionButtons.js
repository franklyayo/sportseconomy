"use client";

import { useState } from "react";

export function RegisterButton({ eventId }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Register as Athlete");

  const handleRegister = async () => {
    setLoading(true);
    setStatus("Registering...");
    
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId })
      });
      
      if (res.ok) {
        setStatus("✅ Registered");
      } else {
        setStatus("Failed. Try again");
      }
    } catch (e) {
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className="button-primary" 
      onClick={handleRegister} 
      disabled={loading || status === "✅ Registered"}
      style={{width: '100%'}}
    >
      {status}
    </button>
  );
}

export function BookButton({ facilityId, isAvailable }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(isAvailable ? "Book Now" : "Currently Unavailable");

  const handleBook = async () => {
    if (!isAvailable) return;
    
    setLoading(true);
    setStatus("Processing...");
    
    try {
      const res = await fetch("/api/infrastructure/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facilityId, date: new Date().toISOString() })
      });
      
      if (res.ok) {
        setStatus("✅ Booking Requested");
      } else {
        setStatus("Failed. Try again");
      }
    } catch (e) {
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={`button-primary`} 
      onClick={handleBook} 
      disabled={loading || !isAvailable || status === "✅ Booking Requested"}
      style={{
        width: '100%', 
        backgroundColor: !isAvailable ? 'var(--surface-border)' : 'var(--primary)',
        color: !isAvailable ? 'var(--text-muted)' : 'white'
      }}
    >
      {status}
    </button>
  );
}

export function ApplyButton({ fundingId, isClosed }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(isClosed ? "Application Closed" : "Apply Now");

  const handleApply = async () => {
    if (isClosed) return;
    
    setLoading(true);
    setStatus("Submitting...");
    
    try {
      const res = await fetch("/api/funding/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fundingId })
      });
      
      if (res.ok) {
        setStatus("✅ Application Under Review");
      } else {
        setStatus("Failed. Try again");
      }
    } catch (e) {
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={`button-primary`} 
      onClick={handleApply} 
      disabled={loading || isClosed || status === "✅ Application Under Review"}
      style={{
        width: '100%', 
        backgroundColor: isClosed ? 'var(--surface-border)' : 'var(--primary)',
        color: isClosed ? 'var(--text-muted)' : 'white'
      }}
    >
      {status}
    </button>
  );
}
