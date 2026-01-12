import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store/store';
import { getMe } from './store/slices/authSlice';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import SocketNotification from './components/SocketNotification';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const CreateGig = lazy(() => import('./pages/CreateGig'));
const GigDetail = lazy(() => import('./pages/GigDetail'));
const MyGigs = lazy(() => import('./pages/MyGigs'));
const MyBids = lazy(() => import('./pages/MyBids'));

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in on app load
    dispatch(getMe());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <SocketNotification />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/create-gig"
              element={
                <PrivateRoute>
                  <CreateGig />
                </PrivateRoute>
              }
            />
            <Route
              path="/gigs/:id"
              element={
                <PrivateRoute>
                  <GigDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-gigs"
              element={
                <PrivateRoute>
                  <MyGigs />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-bids"
              element={
                <PrivateRoute>
                  <MyBids />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
