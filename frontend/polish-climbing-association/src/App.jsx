import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Events from './pages/Events';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <Events />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
