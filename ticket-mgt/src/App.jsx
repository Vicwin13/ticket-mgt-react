import './App.css'
import 'react-toastify/dist/ReactToastify.css'

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import { Analytics } from "@vercel/analytics/react"
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'
import Home from './components/Home'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Signup from './components/Signup'
import TicketManagement from './components/TicketManagement'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<><Home /><Footer /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <TicketManagement />
                <Footer />
              </ProtectedRoute>
            }
          />
        <Analytics/>
        </Routes>
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
          theme="light"
        />
      </div>
    </Router>
  )
}

export default App
