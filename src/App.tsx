
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/providers/AppProvider';
import AppLayout from '@/components/Layout/AppLayout';
import Home from '@/pages/Home/Home';
import Alerts from '@/pages/Alerts/Alerts';
import CurrentState from '@/pages/CurrentState/CurrentState';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/" element={<AppLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="current-state" element={<CurrentState />} />
          </Route>
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
