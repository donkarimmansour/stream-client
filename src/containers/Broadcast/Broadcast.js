import React, { useState, useEffect } from 'react'
import { YOUTUBE_PRIVACY_POLICY } from '../../constants/constants'
import Button from '../../components/Buttons/Button'
import Selected from '../../components/Selected/Selected'
import TextInput from '../../components/TextInput/TextInput'
import TextArea from '../../components/TextArea/TextArea'
import Navbar from '../../components/Navbar/Navbar'
import Modal from 'react-modal'
import getCookie from '../../utils/getCookie'
import BroadcastAvatar from '../../components/Avatars/BroadcastAvatar'
import * as MdIcons from 'react-icons/md'
import * as FaIcons from 'react-icons/fa'
import './Broadcast.css'
import styles from '../../styles/styles'
import { useNavigate } from 'react-router-dom'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import eventTrack from '../../utils/eventTrack'
import timeFromUserRegistration from '../../utils/timeFromUserRegistration'
import DisabledBroadcastAvatar from '../../components/Avatars/DisabledBroadcastAvatar'
import FbAuth from '../../components/Authentication/FbAuth'
import { Toaster } from 'react-hot-toast'
import { CreateYtBroadcast } from '../../api/youtube'
import { AccessUser } from '../../api/user'
import { GetDestination } from '../../api/destination'
import { CreateBroadcast } from '../../api/broadcast'
import checkError from '../../utils/checkError'
import { CreateFbBroadcast } from '../../api/facebook'
import toastErrorMessage from '../../utils/toastErrorMessage'

Modal.defaultStyles.overlay.backgroundColor = 'rgba(45, 45, 47, 0.75)'
Modal.defaultStyles.overlay.zIndex = 101
Modal.setAppElement('#root')

/* global gapi */

function Broadcast() {
  const [isModalOpen, setisModalOpen] = useState(false)

  const [modalContent, setmodalContent] = useState({
    facebook: false,
    youtube: false,
    customRTMP: false,
  })

  const [showBroadcastAvatar, setshowBroadcastAvatar] = useState({ //check if added in db
    facebook: false,
    youtube: false,
    customRTMP: true,
  })

  const [modalContentDisplayed, setmodalContentDisplayed] = useState('')

  const [loading, setloading] = useState(false)
  const [youtubeTitle, setyoutubeTitle] = useState('')

  const [facebookTitle, setfacebookTitle] = useState('')
  const [youtubeDescription, setyoutubeDescription] = useState('')
  const [facebookDescription, setfacebookDescription] = useState('')
  const [youtubePrivacyPolicy, setyoutubePrivacyPolicy] = useState({
    value: 'Public',
    label: 'Public',
  })

  const [id, setId] = useState(getCookie('userId'))
  const [daysSinceUserSignUp, setdaysSinceUserSignUp] = useState('')

  const [youtubeTitleError, setyoutubeTitleError] = useState('')
  const [facebookTitleError, setfacebookTitleError] = useState('')
  const [facebookDescriptionError, setfacebookDescriptionError] = useState('')
  const [noSelectedDestinationError, setnoSelectedDestinationError] = useState(false)

  const [facebookUserId, setfacebookUserId] = useState('')
  const [longFacebookAccessToken, setlongFacebookAccessToken] = useState('')

  const [youtubeAccessToken, setYoutubeAccessToken] = useState(null)
  const [youtubeRefreshToken, setYoutubeRefreshToken] = useState(null)

  // for custom RTMP server
  const [customRtmpServer, setcustomRtmpServer] = useState('')
  const [customRtmpStreamKey, setcustomRtmpStreamKey] = useState('')
  const [customRtmpServerError, setcustomRtmpServerError] = useState('')

  const navigate = useNavigate()

  const closeModal = () => {
    setisModalOpen(false)
  }



  const openModal = () => {
    setisModalOpen(true)
    eventTrack('App', 'Create New Broadcast', 'Button')
  }

  useEffect(() => {

    // api call to show broadcast avatar and get data about user account

    AccessUser(id).then(({ data }) => {

      setshowBroadcastAvatar({
        //check if added in db
        facebook: data.msg.facebook_auth,
        youtube: data.msg.youtube_auth,
        customRTMP: true,
      })

      setdaysSinceUserSignUp(
        timeFromUserRegistration(res.data.user_date_created)
      )


    }).catch(err => {
      if (err?.response?.data?.err) {
        console.log(checkError(err?.response?.data?.msg));
      }
    })


    // api call to get twitch data

    GetDestination(id).then(({ data }) => {

      const {//get if added in db 
        facebook_user_id, facebook_long_access_token, youtube_access_token, facebook_access_token
      } = data.msg

      setfacebookUserId(facebook_user_id)
      //setfacebookAccessToken(facebook_access_token)
      setlongFacebookAccessToken(facebook_long_access_token)

      setYoutubeAccessToken(youtube_access_token)
      setYoutubeRefreshToken(facebook_access_token)


    }).catch(err => {
      if (err?.response?.data?.err) {
        console.log(checkError(err?.response?.data?.msg));
      }
    })


    // YtRefresh({id , refreshToken : youtubeRefreshToken})
    // .then((res) => { console.log(res) })
    // .catch((err) => { console.log(err) })



    if (window.location.search.includes('code=')) {

      //  logic for Youtube
      let code = getUrlParams('code')

      youtubeAuth(id, code)

    }



    setTimeout(() => {
      FB.getLoginStatus(function (response) {
        if (response.status !== 'connected') {
          facebookAuth()
        }
      });
    }, 10000)




  }, [])



  const youtubeAuthClient = () => {

    const google_auth_token_endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = `?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${YOUTUBE_REDIRECT_URL}&scope=${SCOPE}&response_type=code&access_type=offline&prompt=consent`


    window.location.href = `${google_auth_token_endpoint}${options}`
  }





  const youtubePromiseChain = async () => {
    try {
      if (modalContent.youtube) {

        const data = {
          id: id,
          youtubeRefreshToken,
          youtubePrivacyPolicy: youtubePrivacyPolicy.value.toLowerCase(),
          youtubeBroadcastTitle: youtubeTitle,
          youtubeBroadcastDescription: youtubeDescription,
          youtubeAccessToken: youtubeAccessToken
        }

        let YtData

        await CreateYtBroadcast(data).then(async ({ data }) => {

          YtData = data.msg

        }).catch(() => {
          toastErrorMessage('error')
        })

        return {
          youtubeBroadcastId: YtData.youtubeBroadcastId,
          youtubeStreamId: YtData.youtubeStreamId,
          youtubeDestinationUrl: YtData.youtubeDestinationUrl
        }

      } else
        return {
          youtubeBroadcastId: '',
          youtubeStreamId: '',
          youtubeDestinationUrl: '',
        }
    } catch (error) {
      console.log(error)
    }
  }




  const facebookPromiseChain = async () => {
    if (modalContent.facebook) {
      // console.log('facebook promise chain')

      const data = { facebookUserId, facebookTitle, facebookDescription, longFacebookAccessToken }

      let facebookData

      await CreateFbBroadcast(data).then(({ data }) => {
        facebookData = data.msg
      }).catch((err) => {
        if (err?.response?.data?.err) {
          console.log(checkError(err?.response?.data?.msg));
        }
      })



      let facebookLiveVideoId = facebookData.id
      let facebookDestinationUrl = facebookData.secure_stream_url

      return {
        facebookLiveVideoId: facebookLiveVideoId,
        facebookDestinationUrl: facebookDestinationUrl,
      }
    } else return { facebookLiveVideoId: '', facebookDestinationUrl: '' }
  }





  const submit = () => {
    if (
      !modalContent.youtube &&
      !modalContent.facebook &&
      !modalContent.customRTMP
    ) {
      setnoSelectedDestinationError(true)
      setTimeout(() => {
        setnoSelectedDestinationError(false)
      }, 3000)
      return
    }

    if (modalContent.youtube && !youtubeTitle) {
      setyoutubeTitleError('Please enter a Youtube title')
      return
    }
    if (modalContent.facebook && !facebookTitle) {
      setfacebookTitleError('Please enter a Facebook title')
      return
    }
    if (modalContent.facebook && !facebookDescription) {
      setfacebookDescriptionError('Please enter a Facebook description')
      return
    }
    if (modalContent.customRTMP && !customRtmpServer) {
      setcustomRtmpServerError('Please enter a custom RTMP server')
      return
    } else {
      return allPromises()
    }
  }

  const allPromises = () => {

    setloading(true)

    Promise.all([youtubePromiseChain(), facebookPromiseChain()]).then((values) => {
      const flatObj = Object.assign({}, ...values)

      const { youtubeDestinationUrl, youtubeBroadcastId, youtubeStreamId, facebookLiveVideoId, facebookDestinationUrl } = flatObj


      sendDataToDB(
        youtubeDestinationUrl,
        youtubeBroadcastId,
        youtubeStreamId,
        facebookLiveVideoId,
        facebookDestinationUrl,
        customRtmpServer,
        customRtmpStreamKey
      )



    })
  }



  const sendDataToDB = (
    youtubeDestinationUrl,
    youtubeBroadcastId,
    youtubeStreamId,
    facebookLiveVideoId,
    facebookDestinationUrl,
    customRtmpServer,
    customRtmpStreamKey
  ) => {
    const data = {
      youtubeTitle,
      youtubeDescription,
      youtubePrivacyPolicy: youtubePrivacyPolicy.value.toLowerCase(),
      id,
      youtubeDestinationUrl,
      youtubeBroadcastId,
      youtubeStreamId,
      facebookTitle,
      facebookDescription,
      facebookLiveVideoId,
      facebookDestinationUrl,
      customRtmpServer,
      customRtmpStreamKey,
    }


    CreateBroadcast(data).then(({ data }) => {
      console.log(data.msg);
      let studioId = data.msg

      navigate(`/studio`)

    }).catch((err) => {
      if (err?.response?.data?.err) {
        console.log(checkError(err?.response?.data?.msg));
      }
    })


  }













  const modalContentDisplayFunc = () => {

    if (modalContent.youtube === true && modalContentDisplayed === 'youtube') {
      return (
        <>
          <TextInput
            label='Title'
            placeholder=''
            value={youtubeTitle}
            onChange={(e) => {
              setyoutubeTitle(e.target.value)
              if (youtubeTitleError) {
                setyoutubeTitleError('')
              }
            }}
            errorMsg={youtubeTitleError ? youtubeTitleError : null}
          />
          <TextArea
            label={
              <span>
                Description <i style={{ color: '#ccc' }}>(Optional)</i>
              </span>
            }
            value={youtubeDescription}
            onChange={(e) => setyoutubeDescription(e.target.value)}
          />
          <Selected
            label='Privacy'
            options={YOUTUBE_PRIVACY_POLICY}
            value={youtubePrivacyPolicy}
            onChange={(e) => {
              setyoutubePrivacyPolicy(e)
            }}
          />
        </>
      )
    }

    else if (
      modalContent.facebook === true &&
      modalContentDisplayed === 'facebook'
    ) {
      return (
        <>
          <TextInput
            label='Title'
            placeholder=''
            value={facebookTitle}
            onChange={(e) => {
              setfacebookTitle(e.target.value)
              if (facebookTitleError) {
                setfacebookTitleError('')
              }
            }}
            errorMsg={facebookTitleError ? facebookTitleError : null}
          />
          <TextArea
            label='Description'
            value={facebookDescription}
            onChange={(e) => {
              setfacebookDescription(e.target.value)
              if (facebookDescriptionError) {
                setfacebookDescriptionError('')
              }
            }}
            errorMsg={
              facebookDescriptionError ? facebookDescriptionError : null
            }
          />
        </>
      )
    } else if (
      modalContent.customRTMP === true &&
      modalContentDisplayed === 'customRTMP'
    ) {
      return (
        <>
          {/* <p>Custom RTMP destination</p> */}
          <TextInput
            label='Stream URL'
            placeholder=''
            value={customRtmpServer}
            onChange={(e) => {
              setcustomRtmpServer(e.target.value)
              if (customRtmpServerError) {
                setcustomRtmpServerError('')
              }
            }}
            errorMsg={customRtmpServerError ? customRtmpServerError : null}
          />
          <TextInput
            label='Stream Key'
            placeholder=''
            value={customRtmpStreamKey}
            onChange={(e) => setcustomRtmpStreamKey(e.target.value)}
            errorMsg={null}
          />
        </>
      )
    }
  }

  return (
    <>
      <Navbar />
      <Toaster position='top-center' reverseOrder={true} />

      <div className='broadcast-container'>
        <h2 className='broadcast-title' style={{ marginTop: '2rem' }}>
          Broadcasts
        </h2>
        <Button
          id='create-new-broadcast-button'
          fx={openModal}
          title='Create new broadcast'
        />
      </div>
      <Modal
        className='broadcast-modal'
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel='Example Modal'
      >
        <div
          onClick={closeModal}
          className='modal-close-icon'
          style={{ float: 'right' }}
        >
          <MdIcons.MdClose color='grey' size={24} />
        </div>
        <>
          <p className='broadcast-to-text'>Broadcast to:</p>

          <div style={{ display: 'flex', marginBottom: '1rem' }}>

            {showBroadcastAvatar.youtube ? (
              <BroadcastAvatar
                style={
                  modalContent.youtube === true
                    ? { border: styles.broadcastAvatarBorder }
                    : null
                }
                onClick={() => {
                  setmodalContent((prev) => ({
                    ...prev,
                    youtube: !prev.youtube,
                  }))
                  setmodalContentDisplayed('youtube')
                }}
              >
                <FaIcons.FaYoutube
                  data-tip='Youtube'
                  color={'#ff0000'}
                  size={35}
                />
                <ReactTooltip />
              </BroadcastAvatar>
            ) : (
              <DisabledBroadcastAvatar onClick={youtubeAuthClient}>
                <FaIcons.FaYoutube
                  data-tip='Click to Enable Youtube'
                  color={'grey'}
                  size={35}
                />
                <ReactTooltip />
              </DisabledBroadcastAvatar>
            )}

            {showBroadcastAvatar.facebook ? (
              <BroadcastAvatar
                style={
                  modalContent.facebook === true
                    ? { border: styles.broadcastAvatarBorder }
                    : null
                }
                onClick={() => {
                  setmodalContent((prev) => ({
                    ...prev,
                    facebook: !prev.facebook,
                  }))
                  setmodalContentDisplayed('facebook')
                }}
              >
                <FaIcons.FaFacebookF
                  data-tip='Facebook'
                  color={'#1676f2'}
                  size={35}
                />
                <ReactTooltip className='react-tooltip' />
              </BroadcastAvatar>
            ) : (
              <FbAuth />
            )}

            {/* CUSTOM RTMP SERVER AND STREAM KEY */}
            {showBroadcastAvatar.customRTMP ? (
              <BroadcastAvatar
                style={
                  modalContent.customRTMP === true
                    ? { border: styles.broadcastAvatarBorder }
                    : null
                }
                onClick={() => {
                  setmodalContent((prev) => ({
                    ...prev,
                    customRTMP: !prev.customRTMP,
                  }))
                  setmodalContentDisplayed('customRTMP')
                }}
              >
                <img
                  data-tip='custom RTMP server'
                  src="/rtmp.png"
                  alt='custom RTMP destination for streaming'
                  style={{ height: '30px', maxWidth: '30px' }}
                />
                <ReactTooltip className='react-tooltip' />
              </BroadcastAvatar>
            ) : null}
          </div>
          {noSelectedDestinationError && (
            <p className='please-select-error' style={{ color: 'red' }}>
              Please select at least one platform to broadcast on.
            </p>
          )}

          {modalContentDisplayFunc()}

          <Button
            id='create-broadcast-button'
            disabled={loading}
            loading={loading}
            style={{ width: '100%' }}
            title='Create Broadcast'
            fx={submit}
          />
        </>
      </Modal>
    </>
  )
}

export default Broadcast
