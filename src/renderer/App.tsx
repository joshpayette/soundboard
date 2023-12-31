import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import HomeView from './views/Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
      </Routes>
    </Router>
  );
}
