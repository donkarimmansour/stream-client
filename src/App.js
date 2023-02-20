import React, { useEffect, useState, Suspense, lazy } from 'react'
import { BrowserRouter , Route, Routes } from 'react-router-dom'
import ReactGA from 'react-ga'
import Login from './containers/Login/Login'
import Register from './containers/Register/Register'
import Code from './containers/Code/Code'
import getCookie from './utils/getCookie'
import PageNotFound from './containers/PageNotFound/PageNotFound'
import Broadcast from './containers/Broadcast/Broadcast'
import Destinations from './containers/Destinations/Destinations'
import Studio from './containers/Studio/Studio'
import Spinner from './website/Spinner/Spinner'
import ProtectedRoute from './ProtectedRoute'
import AuthRoute from './AuthRoute'

const Website = lazy(() => import('./website/Website/Website'))

function App() {
   const [isLoggedIn, setisLoggedIn] = useState('')

  useEffect(() => {
    let login = getCookie('isLoggedIn')
    setisLoggedIn(login)
  }, [isLoggedIn])

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)
    ReactGA.pageview(window.location.pathname + window.location.search)
    ReactGA.set({
      username: getCookie('userEmail'),
    // Other relevant user information
    })
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/broadcast' element={<ProtectedRoute><Broadcast/></ProtectedRoute>} />
          <Route path='/destinations' element={<ProtectedRoute><Destinations/></ProtectedRoute>} />
          <Route path='/studio' element={<ProtectedRoute><Studio/></ProtectedRoute>} />
 
          <Route path='/login/code' element={<AuthRoute><Code/></AuthRoute>} />
          <Route path='/login' element={<AuthRoute><Login/></AuthRoute>} />
          <Route path='/register/code' element={<AuthRoute><Code/></AuthRoute>} />
          <Route path='/register' element={<AuthRoute><Register/></AuthRoute>} />

            <Route exact path='/' element={
              <Suspense fallback={<Spinner />}>
                <AuthRoute><Website />
                </AuthRoute>
              </Suspense>
            } />

          <Route path='*' element={<PageNotFound/>} />
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
