// App.jsx
import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LHome from './pages/LHome';
import PaginatedBooks from './pages/PaginatedBooks';
import LHomePaging from './pages/LHomePaging';
import BookList from './pages/BookList';

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
            <Route path="/lh" element={<LHome />} />
            <Route path="/p" element={<PaginatedBooks />} />
            <Route path="/" element={<LHomePaging />} />
            <Route path="/bl" element={<BookList />} />
          </Routes>
        </div>
      </Router>
    </DarkModeContext.Provider>
  );
};

export default App;
