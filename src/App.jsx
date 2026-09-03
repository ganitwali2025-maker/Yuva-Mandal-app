import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Toast from './components/layout/Toast';

// Pages
import Home from './pages/Home';
import Members from './pages/Members';
import AddMember from './pages/AddMember';
import IdCard from './pages/IdCard';
import MashikJama from './pages/MashikJama';
import Sahyog from './pages/Sahyog';
import खर्च from './pages/खर्च';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import UdharChanda from './pages/UdharChanda';

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
          <Route path="/mashik-jama" element={<MashikJama />} />
          <Route path="/sahyog" element={<Sahyog />} />
          <Route path="/expense" element={<खर्च />} />
          <Route path="/udhar-chanda" element={<UdharChanda />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
      <Toast />
    </AppProvider>
  );
}
