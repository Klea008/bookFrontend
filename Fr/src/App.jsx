// App.jsx
import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import LHome from './pages/LHome';

// Create a Context for dark mode
const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <Router>
        <div className={`flex flex-col min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/LHome" element={<LHome />} />
          </Routes>
        </div>
      </Router>
    </DarkModeContext.Provider>
  );
};

export default App;
