import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataSources from './pages/DataSources';
import DatabaseView from './pages/DatabaseView';
import Intelligence from './pages/Intelligence';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DashboardLayout from './layouts/DashboardLayout';

import { DataProvider } from './context/DataContext';

import GraphExplorer from './pages/GraphExplorer';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="graph" element={<GraphExplorer />} />
            <Route path="data" element={<DataSources />} />
            <Route path="database" element={<DatabaseView />} />
            <Route path="intelligence" element={<Intelligence />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
