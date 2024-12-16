import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import StorePage from './components/Store/StorePage';
import StockManagement from './components/Management/StockManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<StorePage />} />
          <Route path="management" element={<StockManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;