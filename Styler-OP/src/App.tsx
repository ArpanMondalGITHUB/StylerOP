import './App.css'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import NotFound from './pages/NotFound'
import Home from './pages/home/Home'

function App() {

  return (
    <Routes>
      <Route element={<LandingPage/>} path='/'/>
      <Route path='*' element={<NotFound/>}/>
      <Route path='/home' element={<Home/>}/>
    </Routes>
  )
}

export default App
