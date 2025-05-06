import React from 'react';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <header className="header">
        <h1>ft_transcendence</h1>
        <nav>
          <ul>
            <li><a href="/">Accueil</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} ft_transcendence - Tous droits réservés</p>
      </footer>
    </div>
  );
};

export default Layout;
