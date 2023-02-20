import React, { Fragment } from 'react'
import { Navigate } from 'react-router-dom'
import getCookie from './utils/getCookie'

function AuthRoute({ children }) {
  const isLoggedIn = getCookie('isLoggedIn')
  return (
    <Fragment>
        { !isLoggedIn ? <>{children}</> : <Navigate to={{ pathname: '/broadcast' }} />}
    </Fragment>

  )
}

export default AuthRoute
