import React, { useState } from 'react'
import TextInput from '../../components/TextInput/TextInput'
import Button from '../../components/Buttons/Button'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'
import setCookie from '../../utils/setCookie'
import isEmail from 'validator/lib/isEmail';
import { Register as Singup } from '../../api/user'
import eventTrack from '../../utils/eventTrack'
import checkError from '../../utils/checkError'

function Register() {
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

      eventTrack('Landing Page', 'Sign Up For Free Button Clicked', 'Button')
      setloading(true)

      Singup(email).then(({ data }) => {

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
      <div className='register-container'>
        <div>
          <h2 className='register-title'>Create an account</h2>
          <p className='register-subtitle'>
            We use passwordless sign up. Just enter your email and you'll get a
            code to use.
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
          id='register-button'
          loading={loading}
          style={{ width: '100%' }}
          title='Sign Up'
          fx={handleClick}
        />
        <p style={{ color: 'grey', marginTop: '1rem', textAlign: 'center' }}>
          <Link
            style={{
              textDecoration: 'none',
              color: 'grey',
            }}
            to='/login'
          >
            Already have an account? Sign in
          </Link>
        </p>
      </div>
    </>
  )
}

export default Register
