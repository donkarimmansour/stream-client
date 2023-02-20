import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import * as FaIcons from 'react-icons/fa'
import Navbar from '../../components/Navbar/Navbar'
import BroadcastButton from '../../components/Buttons/BroadcastButton'
import DestinationButton from '../../components/Buttons/DestinationButton'
import StudioButton from '../../components/Buttons/StudioButton'
import Timer from '../../components/Timer/Timer'
import ViewCounter from '../../components/ViewCounter/ViewCounter'
import formatTime from '../../utils/formatTime'
import getCookie from '../../utils/getCookie'
import accurateTimer from '../../utils/accurateTimer'
import useInterval from '../../utils/useInterval'
import './Studio.css'
import { useNavigate } from 'react-router-dom'
import { CAPTURE_OPTIONS_USER_FACING, CAPTURE_OPTIONS_RECORD_SCREEN } from '../../constants/constants'
import { GetBroadcast } from '../../api/broadcast'
import { GetDestination } from '../../api/destination'
import checkError from '../../utils/checkError'
import { FbEnd, FbPermalink, FbViewCount } from '../../api/facebook'
import { UserWentLive } from '../../api/user'
import { YtEnd, YtLive, YtViewCount } from '../../api/youtube'
import Modal from 'react-modal'
import * as MdIcons from 'react-icons/md'
import TextInput from '../../components/TextInput/TextInput'
import Button from '../../components/Buttons/Button'

function Studio() {
  const [youtubeUrl, setyoutubeUrl] = useState('')
  const [youtubeBroadcastId, setYoutubeBroadcastId] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [facebookLiveVideoId, setfacebookLiveVideoId] = useState('')

  const [facebookAccessToken, setfacebookAccessToken] = useState('')
  const [youtubeAccessToken, setYoutubeAccessToken] = useState(null)

  const [longFacebookAccessToken, setlongFacebookAccessToken] = useState('')
  const [facebookPermalinkUrl, setfacebookPermalinkUrl] = useState('')

  const [youtubeViewCount, setyoutubeViewCount] = useState(0)
  const [facebookViewCount, setfacebookViewCount] = useState(0)

  const [customRtmpServer, setcustomRtmpServer] = useState('')
  const [customRtmpStreamKey, setcustomRtmpStreamKey] = useState('')

  const [isActive, setIsActive] = useState(false)
  const [userFacing, setuserFacing] = useState('')
  const [streamFinished, setstreamFinished] = useState(false)
  const [muted, setmuted] = useState(false)
  const [cameraOn, setcameraOn] = useState(false)
  const [shareOn, setshareOn] = useState(false)
  const [videoOn, setvideoOn] = useState(false)

  const email = getCookie('userEmail')

  const stream = useRef(null)

  const videoRef = useRef()
  const mediaRecorder = useRef()



  const [isModalOpen, setisModalOpen] = useState(false)
  const [loading, setloading] = useState(false)
  const [Link, setLink] = useState('https://localhost:3000/big_buck_bunny_projectile_512kb.mp4')  //https://media.w3.org/2010/05/sintel/trailer.mp4
  const [LinkError, setLinkError] = useState('')


  const closeModal = () => {
    setisModalOpen(false)
  }

  const openModal = () => {
    setisModalOpen(true)

  }


  const navigate = useNavigate()
  const socket = useRef()
  const productionWsUrl = 'ws://localhost:3002'

  const streamUrlParams = `?youtubeUrl=${youtubeUrl}&facebookUrl=${encodeURIComponent(facebookUrl)}&customRTMP=${customRtmpServer ? encodeURIComponent(customRtmpServer + '/' + customRtmpStreamKey) : ''}`

  const [elapsedSeconds, setelapsedSeconds] = useState(0)
  const viewCountTimer = 1000 * 60 * 1

  let timer = useRef(null)
  let on = false

  useEffect(() => {
    let id = getCookie('userId')

    //Get Broadcast
    GetBroadcast(id).then(({ data }) => {
      const {
        facebook_destination_url,
        facebook_live_video_id,
        youtube_broadcast_id,
        youtube_destination_url,
        custom_rtmp_server,
        custom_rtmp_stream_key,
      } = data.msg

      setFacebookUrl(facebook_destination_url)
      setfacebookLiveVideoId(facebook_live_video_id)

      setYoutubeBroadcastId(youtube_broadcast_id)
      setyoutubeUrl(youtube_destination_url)

      setcustomRtmpServer(custom_rtmp_server)
      setcustomRtmpStreamKey(custom_rtmp_stream_key)
    }).catch(err => {
      if (err?.response?.data?.err) {
        console.log(checkError(err?.response?.data?.msg));
      }
    })



    //Get Destination

    GetDestination(id).then(({ data }) => {

      const {
        facebook_access_token,
        facebook_long_access_token,
        youtube_access_token
      } = data.msg

      setfacebookAccessToken(facebook_access_token)
      setlongFacebookAccessToken(facebook_long_access_token)
      setYoutubeAccessToken(youtube_access_token)

    }).catch(err => {
      if (err?.response?.data?.err) {
        console.log(checkError(err?.response?.data?.msg));
      }
    })


    //   videoRef.current.srcObject = tempStream.remoteStream


  }, [])


  // useEffect(() => {

  //   if (firstTime === false) {
  //     setTimeout(() => {
  //      // toggleScreenSharing('video')
  //       console.log('init start');
  //      // video()

  //      videoRef.current.src = 'https://media.w3.org/2010/05/sintel/trailer.mp4'

  //     }, 10000);

  //     setFirstTime(true)
  //   }
  // }, [firstTime])



  useEffect(() => {
    // get facebook permalink url

    if (facebookLiveVideoId && facebookLiveVideoId !== '') {

      FbPermalink({ facebookLiveVideoId, longFacebookAccessToken }).then(({ data }) => {
        setfacebookPermalinkUrl(data.msg.permalink_url)
      }).catch(err => {
        if (err?.response?.data?.err) {
          console.log(checkError(err?.response?.data?.msg));
        }
      })

    }

  }, [facebookLiveVideoId])





  useInterval(() => {
    // Your custom logic here
    if (isActive && facebookLiveVideoId) {
      facebookLiveViewCount()
    }
    if (isActive && youtubeBroadcastId) {
      youtubeLiveViewCount()
    }
  }, viewCountTimer)



  const startTimer = () => {
    if (on) return
    timer.current = accurateTimer(() => {
      setelapsedSeconds((elapsedSeconds) => elapsedSeconds + 1)
      on = true
      let seconds = elapsedSeconds % 60
      seconds = seconds > 9 ? seconds : `0${seconds}`
      // console.log(`${elapsedSeconds} seconds have passed.`)
    })
  }

  const stopTimer = () => {
    if (on) console.log('Timer Stopped')
    on = false
    timer.current.cancel()
  }



  async function screen() {
    stream.current = await navigator.mediaDevices.getDisplayMedia(
      CAPTURE_OPTIONS_RECORD_SCREEN
    )
    stream.current.replaceVideoTrack(stream.current.getVideoTracks()[0])

    videoRef.current.srcObject = stream.current
  }

  async function camera() {
    stream.current = await navigator.mediaDevices.getUserMedia(
      CAPTURE_OPTIONS_USER_FACING
    )

    stream.current.replaceVideoTrack(stream.current.getVideoTracks()[0])
    stream.current.replaceAudioTrack(stream.current.getAudioTracks()[0])
    videoRef.current.srcObject = stream.current
  }

  async function video(link) {

    videoRef.current.srcObject = null
    videoRef.current.src = link //'https://media.w3.org/2010/05/sintel/trailer.mp4'
  }

  const toggleMicrophone = () => {
    setmuted(!muted)

    if (userFacing === 'camera') {
      if (stream.current.getAudioTracks()[0].readyState === 'live') {
        stream.current.getAudioTracks()[0].enabled = false
      } else {
        stream.current.getAudioTracks()[0].enabled = true
      }
    }

  }


  const startRecording = () => {
    //transitionYoutubeToLive()

    socket.current = io(productionWsUrl + streamUrlParams, { transports: ['websocket'] })


    toggleActive()
    recorderInit()
    startTimer()


    const data = {
      email,
      destinations: [
        facebookUrl ? 'FACEBOOK' : null,
        youtubeUrl ? 'YOUTUBE' : null,
        customRtmpStreamKey ? 'CUSTOM_RTMP' : null,
      ]
    }

    UserWentLive(data).then(({ data }) => {
      console.log('UserWentLive => ', data);

    }).catch(err => {
      // if (err?.response?.data?.err) {
      //   console.log(checkError(err?.response?.data?.msg));
      // }

      console.log('UserWentLive => err =>', err);

    })

    // start streaming to Youtube
    if (youtubeBroadcastId) {
      setTimeout(() => {
        transitionYoutubeToLive()
      }, 10000)
    }


  }

  // toggles the stream to active or inactive
  const toggleActive = () => {
    setIsActive(!isActive)
  }

  const recorderInit = () => {
    let liveStream = videoRef.current.captureStream(30) // 30 FPS

    mediaRecorder.current = new MediaRecorder(liveStream, {
      mimeType: 'video/webm;codecs=h264',
      // mimeType: 'video/webm;codecs=vp8,opus',
      videoBitsPerSecond: 3 * 1024 * 1024,
    })
    mediaRecorder.current.ondataavailable = (e) => {

      socket.current.send(e.data)
      // chunks.push(e.data)
      console.log('send data', e.data)
    }
    // Start recording, and dump data every second
    mediaRecorder.current.start(1000)
  }

  const stopRecording = () => {
    toggleActive()
    mediaRecorder.current.stop()
    socket.current.close()
    endYoutubeStream()
    endFacebookLivestream()
    setstreamFinished(true)
    stopTimer()

  }

  const toggleRecording = () => {
    !isActive ? startRecording() : stopRecording()
  }

  const toggleScreenSharing = (val) => {
    if (val === 'video') {

      openModal()

    } else if (val === 'screen') {
      shareOn ? toggleCamera() : screen()
      setcameraOn(false)
      setshareOn(true)
      setvideoOn(false)
    } else if (val === 'camera') {
      cameraOn ? toggleCamera() : camera()
      setcameraOn(!cameraOn)
      setshareOn(false)
      setvideoOn(false)
    }
    // userFacing ? screen() : camera()
    setuserFacing(val)
  }



  const toggleCamera = () => {
    if (stream.current.getVideoTracks()[0].readyState === 'live') {
      // stream.current.getVideoTracks()[0].enabled =  !stream.current.getVideoTracks()[0].enabled
      stream.current.getVideoTracks()[0].enabled = false
      stream.current.getVideoTracks()[0].stop()
    } else {
      stream.current.getVideoTracks()[0].enabled = true
      stream.current.getVideoTracks()[0].start()
    }
  }



  //!!! CLICK GO LIVE FIRST TO SEND VIDEO TO THE SERVER and then CALL transitionToLive
  const transitionYoutubeToLive = () => {
    YtLive({ youtubeBroadcastId, youtubeAccessToken }).then(({ data }) => {

      console.log('YtLive => ', data);
    }).catch(err => {
      console.log('YtLive => err =>', err);

      // if (err?.response?.data?.err) {
      //   console.log(checkError(err?.response?.data?.msg));
      // }

    })

  }

  //!!! THIS IS CALLED AT THE VERY END TO STOP THE YOUTUBE BROADCAST
  const endYoutubeStream = () => {

    YtEnd({ youtubeBroadcastId, youtubeAccessToken }).then(({ data }) => {
      console.log('YtEnd => ', data);

    }).catch(err => {

      // if (err?.response?.data?.err) {
      //   console.log(checkError(err?.response?.data?.msg));
      // }

      console.log('YtEnd => err =>', err);


    })


  }




  const addVideo = () => {

    setloading(true)
    if (Link.length < 10) {
      setLinkError('Please enter a video link')

    } else {
      video(Link)
      setcameraOn(false)
      setshareOn(false)
      setvideoOn(true)
      closeModal()
    }
    setloading(false)


  }


  const youtubeLiveViewCount = () => {

    YtViewCount({ youtubeBroadcastId, youtubeAccessToken }).then(({ data }) => {
      console.log('YtViewCount => ', data);

    }).catch(err => {

      // if (err?.response?.data?.err) {
      //   console.log(checkError(err?.response?.data?.msg));
      // }

      console.log('YtViewCount => err =>', err);


    })


  }



  const facebookLiveViewCount = () => {

    FbViewCount({ facebookLiveVideoId: facebookLiveVideoId, facebookAccessToken: longFacebookAccessToken }).then(({ data }) => {

      if (data.msg.views) setfacebookViewCount(data.msg.views)

    }).catch(err => {
      if (err?.response?.data?.err) {
        console.log(checkError(err?.response?.data?.msg));
      }


    })

  }

  const endFacebookLivestream = () => {
    if (facebookLiveVideoId) {
      const data = {
        liveVideoId: facebookLiveVideoId,
        // accessToken: facebookAccessToken,
        longFacebookAccessToken: longFacebookAccessToken,
      }

      FbEnd(data).then(({ data }) => {

      }).catch(err => {
        if (err?.response?.data?.err) {
          console.log(checkError(err?.response?.data?.msg));
        }
      })



    } else return null
  }

  const exitStudio = () => {
    console.log('exit studio')
    navigate('/broadcast')
  }



  return (
    <>
      <Navbar>
        <div style={{ marginTop: '8px' }}>
          {youtubeUrl && (
            <a
              href={`https://studio.youtube.com/video/${youtubeBroadcastId}/livestreaming`}
              rel='noreferrer'
              target='_blank'
            >
              <DestinationButton>
                <FaIcons.FaYoutube color={'#ff0000'} size={20} />
              </DestinationButton>
            </a>
          )}

          {facebookUrl && (
            <a
              href={`https://www.facebook.com${facebookPermalinkUrl}`}
              rel='noreferrer'
              target='_blank'
            >
              <DestinationButton>
                <FaIcons.FaFacebook color={'#1676f2'} size={20} />
              </DestinationButton>
            </a>
          )}
          {customRtmpServer && (
            <DestinationButton>
              <FaIcons.FaKey color={'#f2d209'} size={20} />
            </DestinationButton>
          )}
          <BroadcastButton
            disabled={streamFinished ? true : false}
            id='play-button'
            title={!isActive ? 'Go Live' : 'Stop Recording'}
            fx={toggleRecording}
          />
        </div>
      </Navbar>

      <div>
        <div className='studio-container'>



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
              <p className='broadcast-to-text'>Add Link:</p>

              <div style={{ marginBottom: '1rem' }}>

                <TextInput
                  label='Link'
                  placeholder=''
                  value={Link}
                  onChange={(e) => {
                    setLink(e.target.value)
                    if (LinkError) {
                      setLinkError('')
                    }
                  }}
                  errorMsg={LinkError ? LinkError : null}
                />

              </div>


              <Button
                disabled={loading}
                loading={loading}
                style={{ width: '100%' }}
                title='add link'
                fx={addVideo}
              />
            </>
          </Modal>





          <div id='container'>
            <div
              className='time-view-container'
              style={
                elapsedSeconds === 0
                  ? { visibility: 'hidden' }
                  : {
                    visibility: 'visible',
                  }
              }
            >
              <Timer>
                {isActive ? 'LIVE' : 'END'}: {formatTime(elapsedSeconds)}
              </Timer>
              {/* {twitchStreamKey && (
                <ViewCounter title={'Twitch'} num={twitchViewCount} />
              )} */}
              {youtubeBroadcastId && (
                <ViewCounter title={'Youtube'} num={youtubeViewCount} />
              )}
              {facebookLiveVideoId && (
                <ViewCounter title={'Facebook'} num={facebookViewCount} />
              )}
            </div>

            <div>
              <p
                style={
                  userFacing !== 'share'
                    ? {
                      display: 'none',
                    }
                    : null
                }
              >
                You are currently sharing your screen. Go to a different tab or
                desktop app to share.
              </p>

              <video
                // style={
                //   !userFacing
                //     ? {
                //         visibility: 'hidden',
                //       }
                //     : null
                // }
                className='video-container'
                ref={videoRef}
                autoPlay
                playsInline
                muted={muted}
                loop={userFacing === 'video' ? true : false}
              />
            </div>
          </div>
          {/* STUDIO BUTTONS */}
          <div className='studio-bottom-button-container'>

            <StudioButton label={'Video'} onClick={() => { toggleScreenSharing("video") }}>
              {videoOn ? (
                <FaIcons.FaFileVideo color='#eb3472' size={20} />
              ) : (
                <FaIcons.FaFileVideo size={20} />
              )}

            </StudioButton>

            <StudioButton label={'Screen'} onClick={() => { toggleScreenSharing("screen") }}>
              {shareOn ? (
                <FaIcons.FaLaptop color='#eb3472' size={20} />
              ) : (
                <FaIcons.FaLaptop size={20} />
              )}
            </StudioButton>

            <StudioButton label={'Camera'} onClick={() => { toggleScreenSharing("camera") }}>
              {cameraOn ? (
                <FaIcons.FaVideo color='#eb3472' size={20} />
              ) : (
                <FaIcons.FaVideoSlash size={20} />
              )}
            </StudioButton>

            <StudioButton label={'Mic'} onClick={toggleMicrophone}>
              {!muted ? (
                <FaIcons.FaMicrophone color='#eb3472' size={20} />
              ) : (
                <FaIcons.FaMicrophoneSlash size={20} />
              )}
            </StudioButton>

            <StudioButton label={'Leave Studio'} onClick={exitStudio}>
              <FaIcons.FaPhoneSlash color='#eb3472' size={20} />
            </StudioButton>
          </div>

        </div>

      </div>
    </>
  )
}

export default Studio
