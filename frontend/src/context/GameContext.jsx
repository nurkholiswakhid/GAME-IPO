import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto login jika ada session di localStorage
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/students/${sessionId}`)
        .then(res => setStudent(res.data))
        .catch(() => {
          localStorage.removeItem('sessionId');
          setStudent(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginStudent = (data) => {
    localStorage.setItem('sessionId', data.session_id);
    setStudent(data.student);
  };

  const logoutStudent = () => {
    localStorage.removeItem('sessionId');
    setStudent(null);
  };
  
  // Fungsi dipanggil untuk sync point setelah level diselesaikan
  const refreshStudentData = async () => {
    const sessionId = localStorage.getItem('sessionId');
    if(sessionId) {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/students/${sessionId}`);
      setStudent(res.data);
    }
  };

  return (
    <GameContext.Provider value={{ student, setStudent, loginStudent, logoutStudent, refreshStudentData, loading }}>
      {children}
    </GameContext.Provider>
  );
};
