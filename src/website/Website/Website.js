import React, { useState } from 'react'
import './Website.css'
import Button from '../../components/Buttons/Button'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Input from '../Input/Input'
import setCookie from '../../utils/setCookie'
import { Register } from '../../api/user'
import isEmail from 'validator/lib/isEmail';
import checkError from '../../utils/checkError'
import eventTrack from '../../utils/eventTrack'

function Website() {
  const [email, setEmail] = useState('')
  const [error, seterror] = useState('')
  const [loading, setloading] = useState(false)

  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setEmail(e.target.value)
    if (error) {
      seterror('')
    }
  }

  const emailSubmitHandler = () => {
    sendAuthCode()
  }

  const sendAuthCode = async () => {

    if (!isEmail(email)) {
      seterror('Please enter a valid email address')

    } else {

      eventTrack('Landing Page', 'Sign Up For Free Button Clicked', 'Button')
      setloading(true)

      Register(email).then(({ data }) => {

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


  
  return (
    <>
      <div className='website-navbar'>
  
        <Link
          className='navbar-logo'
          style={{ float: 'left', fontWeight: '600' }}
          to='/'
        >
          live stream
        </Link>

        <Link
          onClick={() =>
            eventTrack('Landing Page', 'Register Button Clicked', 'Button')
          }
          className='signup-button-in-navbar'
          to='/register'
        >
          Sign-up
        </Link>
        <Link
          className='navbar-logo'
          onClick={() =>
            eventTrack('Landing Page', 'Login Button Clicked', 'Button')
          }
          style={{ fontWeight: '600' }}
          to='/login'
        >
          Login
        </Link>
      </div>

      <div id='section-two'>
        <h1
          style={{
            marginTop: '8rem',
            textAlign: 'center',
          }}
        >
          Multistream Everywhere Easily
        </h1>
        <p className='website-main-description'>
          ✨ Stream to Youtube, Facebook and custom destinations at the
          same time.
        </p>
        <p className='website-main-description'>
          ✨ No complicated downloads — live stream directly from your browser.
        </p>
        <p className='website-main-description'>
          ✨ Start your first stream in &lt;2 minutes
        </p>

        <div className='email-submit-input-container'>
          <div className='email-submit-input-container-child'>
            <Input
              id='enter-email-homepage'
              placeholder='Enter your email'
              onChange={handleInputChange}
              value={email}
              errorMsg={error ? error : null}
            />
          </div>
          <div className='email-submit-input-container-child'>
            <Button
              id='pulse'
              fx={emailSubmitHandler}
              title='Sign up for free'
              loading={loading}
            />
          </div>
        </div>
        <div style={{ marginTop: '2rem' }} className='container-two'>
          <div className='row'>
            <div className='column sm-3'>
              <div className='icon-website-container'>
                <img src='/yt.svg' alt='youtube' />
              </div>
              <p className='website-text-description'>Youtube</p>
            </div>

            <div className='column sm-3'>
              <div className='icon-website-container'>
                <img src='/fb.svg' alt='facebook' />
              </div>
              <p className='website-text-description'>Facebook</p>
            </div>

            <div className='column sm-3'>
              <img src='/rtmp.png' alt='tiktok2' style={{maxWidth:"100px"}} />
              <p className='website-text-description'>
                Custom RTMP destination
              </p>
            </div>
          </div>
        </div>

    
     
        <Footer />
      </div>
    </>
  )
}

export default Website
