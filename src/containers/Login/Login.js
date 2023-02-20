import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TextInput from '../../components/TextInput/TextInput'
import Button from '../../components/Buttons/Button'
import setCookie from '../../utils/setCookie'
import './Login.css'
import isEmail from 'validator/lib/isEmail';
import { Login as Sign } from '../../api/user'
import checkError from '../../utils/checkError'

function Login() { 
  const [email, setEmail] = useState('')
  const [error, seterror] = useState('')
  const [loading, setloading] = useState(false)

  const navigate = useNavigate()

  const handleClick = () => {
    sendAuthCode()
  }


  const sendAuthCode = async () => {

    if (!isEmail(email)) {
      seterror('Please enter a valid email address')

    } else {
      setloading(true)

      Sign(email).then(({ data }) => {

        if (data.msg._id) {
          setCookie('userId', `${data.msg._id}`, 7)
          setCookie('userEmail', data.msg.user_email, 7)
          navigate('/register/code')
        }
      }).catch(err => {
        if (err?.response?.data?.err) {
          seterror(checkError(err?.response?.data?.msg))
        }

      }).finally(() => {
        setloading(false)
      })

    }

}



  const handleInputChange = (e) => {
    setEmail(e.target.value)
    if (error) {
      seterror('')
    }
  }

  return (
    <>
      <div className='login-container'>
        <div>
          <h2 className='login-title'>Log in to your account</h2>
          <p className='login-subtitle'>
            Enter your email and we'll send you a login code.
          </p>
          <TextInput
            label='Email'
            placeholder='Email Address'
            value={email}
            onChange={handleInputChange}
            errorMsg={error ? error : null}
          />
        </div>
        <Button
          loading={loading}
          style={{ width: '100%' }}
          id='login-button'
          title='Sign In'
          fx={handleClick}
        />

        <p style={{ color: 'grey', marginTop: '1rem', textAlign: 'center' }}>
          <Link
            style={{
              textDecoration: 'none',
              color: 'grey',
            }}
            to='/register'
          >
            Don't have an account? Sign Up
          </Link>
        </p>
      </div>
    </>
  )
}

export default Login
