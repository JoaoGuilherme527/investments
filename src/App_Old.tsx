import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FundsTable from './FundsTable'; // Importe o componente da nova tela
import App from './App'; // Sua tela inicial

const App_Old: React.FC = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/fundos">Fundos</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/fundos" element={<FundsTable />} />
      </Routes>
    </Router>
  );
};

export default App_Old;
