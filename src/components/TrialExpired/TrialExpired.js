import React from 'react'
import Button from '../Buttons/Button'
import { useNavigate } from 'react-router-dom'

const TrialExpired = (props) => {
  const navigate = useNavigate()

  return (
    <>
      <p>
        Your two week trial has ended. Please upgrade your account to get access
        to all features.
      </p>
      <Button
        id='upgrade-button'
        style={{ width: '100%' }}
        title='Upgrade'
        fx={() => navigate(`/billing`)}
      />
    </>
  )
}

export default TrialExpired
