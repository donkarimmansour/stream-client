import React, { useState, useEffect } from 'react'
import API from '../../api/api'
import {  useNavigate } from 'react-router-dom'
import TextInput from '../../components/TextInput/TextInput'
import Button from '../../components/Buttons/Button'
import getCookie from '../../utils/getCookie'
import setCookie from '../../utils/setCookie'
import './Code.css'
import { compareCode } from '../../api/user'
import isLength from 'validator/lib/isLength';
import checkError from '../../utils/checkError'

function Code() {
  const [code, setCode] = useState('')
  const [error, seterror] = useState('')
  const [loading, setloading] = useState(false)
  const navigate = useNavigate()

const submit = async () => {
    const userId = getCookie('userId')

    const data = {
      code: code,
      id: userId,
    }

    if (!isLength(code, { min: 6 })) {
      seterror('Please enter a valid code')

    } else {
      setloading(true)

      compareCode(data).then(() => {
        setCookie('isLoggedIn', true, 7)
        navigate('/broadcast')

      }).catch(err => {
        if (err?.response?.data?.err) {
          seterror(checkError(err?.response?.data?.msg))
        }

      }).finally(() => {
        setloading(false)
      })

    }

  }

  const handleCodeChange = (e) => {
    setCode(e.target.value)
    if (error) {
      seterror('')
    }
  }

  return (
    <>
      <div className='code-container'>
        <div>
          <h2 className='code-title'>Email Sent!</h2>
          <p className='code-subtitle'>
            Please check your email for your login code.
          </p>
          <TextInput
            style={error ? { border: '1px solid red' } : null}
            label='Login Code'
            placeholder='Enter 6 digit code'
            value={code}
            maxLength={6}
            onChange={handleCodeChange}
            errorMsg={error ? error : null}
          />
          <Button
            id='code-button'
            fx={submit}
            style={{ width: '100%' }}
            title='Submit'
            loading={loading}
          />
        </div>
      </div>
    </>
  )
}

export default Code
