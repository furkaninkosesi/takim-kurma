import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TeamPage from './TeamPage';
import EditPlayers from './EditPlayers';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/" style={{ margin: '10px', textDecoration: 'none', color: 'blue' }}>
            Takım Kur
          </Link>
          <Link to="/edit-players" style={{ margin: '10px', textDecoration: 'none', color: 'blue' }}>
            Oyuncu Düzenle
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<TeamPage />} />
          <Route path="/edit-players" element={<EditPlayers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
