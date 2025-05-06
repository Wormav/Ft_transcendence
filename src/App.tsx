import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>ft_transcendence</h1>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>© 2025 ft_transcendence</p>
      </footer>
    </div>
  )
}

export default App
