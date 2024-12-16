import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import StockManagement from './components/Store/StockManagement';
import HomePage from './components/Home/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="management" element={<StockManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;