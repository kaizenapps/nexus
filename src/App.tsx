import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataSources from './pages/DataSources';
import Intelligence from './pages/Intelligence';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={
          <DashboardLayout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="data" element={<DataSources />} />
              <Route path="search" element={<Intelligence />} />
            </Routes>
          </DashboardLayout>
        } />
        {/* Profile and Settings are typically protected but for now we wrap them in layout too if we want sidebar, or separate */}
        <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
