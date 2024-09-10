// App.jsx
import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LHome from './pages/LHome';
import PaginatedBooks from './pages/PaginatedBooks';
import LHomePaging from './pages/LHomePaging';
import BookList from './pages/BookList';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster } from 'react-hot-toast';
import useUserStore from './stores/useUserStore';

// Create a Context for dark mode
const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Loading state during authentication check
  if (checkingAuth) {
    return <div>Loading...</div>; // Or any loading spinner
  }

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <Router>
        <div className={`flex flex-col min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : ''}`}>
          <Header />
          <Routes>
            <Route path="/lh" element={<LHome />} />
            <Route path="/p" element={<PaginatedBooks />} />
            <Route path="/" element={<LHomePaging />} />
            <Route path="/bl" element={<BookList />} />
            <Route
              path="/login"
              element={
                !user ? (
                  <Login />
                ) : user.role === 'admin' ? (
                  <Navigate to="/p" />
                ) : (
                  <Navigate to="/lh" />
                )
              }
            />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/lh" />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </DarkModeContext.Provider>
  );
};

export default App;
