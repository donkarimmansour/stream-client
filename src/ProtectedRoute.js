import React, { Fragment } from 'react'
import { Navigate } from 'react-router-dom'
import getCookie from './utils/getCookie'

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = getCookie('isLoggedIn')
  
  return (
    <Fragment> 
        { isLoggedIn ? <>{children}</> : <Navigate to={{ pathname: '/login' }} />} 
    </Fragment>
  )
}

export default ProtectedRoute
