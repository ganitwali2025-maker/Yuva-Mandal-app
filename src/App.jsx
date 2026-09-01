import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Toast from './components/layout/Toast';

// Pages
import Home from './pages/Home';
import Members from './pages/Members';
import AddMember from './pages/AddMember';
import IdCard from './pages/IdCard';
import Chanda from './pages/Chanda';
import Sahyog from './pages/Sahyog';
import Expense from './pages/Expense';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Members />} />
          <Route path="/add-member" element={<AddMember />} />
          <Route path="/idcard/:id" element={<IdCard />} />
          <Route path="/idcard-self" element={<IdCard />} />
          <Route path="/chanda" element={<Chanda />} />
          <Route path="/sahyog" element={<Sahyog />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
      <Toast />
    </AppProvider>
  );
}
