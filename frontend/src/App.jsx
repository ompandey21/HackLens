import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import JudgeDash from './pages/Judge/JudgeDash'
import HackLensAuth from './pages/Auth/Login'
import ProtectedRoute from './utils/ProtectedRoutes'
import ParticipantDash from './pages/Participant/ParticipantDash'
import HackathonForm from './pages/Hackathon/HackathonForm'
import HackathonDashboard from './pages/Hackathon/HackathonDash'
import Hackathons from './pages/Hackathon/Hackathons'
import HackathonDetails from './pages/HackathonDetails/HackathonDetails'
import Navbar from './components/HomeComponents/Navbar'
import Footer from './components/HomeComponents/Footer'
import ProfilePage from './pages/Profile/ProfilePage'
import SubmitProject from './pages/Participant/SubmitProject'



function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<HackLensAuth />} />
        <Route path="/create-hackathon" element={<HackathonForm />} />
        <Route path="/hackathons" element={<Hackathons />} />
        <Route path="/hackathons/:id" element={<HackathonDetails />} />
        <Route path="/me" element={<ProfilePage />} />
        <Route path="/submit_project/:hackathon_id" element={<ProtectedRoute type="participant"><SubmitProject /></ProtectedRoute>} />


        {/* Protected route */}
        <Route
          path="/dashboard/judge"
          element={
            <ProtectedRoute userType = "judge">
              <JudgeDash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/participant"
          element={
            <ProtectedRoute userType = "participant">
              <ParticipantDash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-hackathon"
          element={
            <ProtectedRoute userType = "participant">
              <HackathonForm userType="admin"/>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer/>
    </Router>
    
  )
}

export default App
