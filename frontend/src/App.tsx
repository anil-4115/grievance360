import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Complaints from './pages/Complaints'
import ComplaintDetail from './pages/ComplaintDetail'
import Institutions from './pages/Institutions'
import Recommendations from './pages/Recommendations'
import Alerts from './pages/Alerts'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/complaints/:id" element={<ComplaintDetail />} />
        <Route path="/institutions" element={<Institutions />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </Layout>
  )
}

export default App
