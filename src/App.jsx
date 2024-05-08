import React from 'react'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Certificate from './pages/Certificate'
import { BrowserRouter  as Router, Route} from 'react-router-dom';
import { Routes } from 'react-router-dom';

const App = () => {
  return (

    <Router>
      <Navbar />
      <div className='max-w-screen-md mx-auto pt-20'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/certificate' element={<Certificate />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
