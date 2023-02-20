import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Card from '../../components/Card/Card'
import getCookie from '../../utils/getCookie'
import toastSuccessMessage from '../../utils/toastSuccessMessage'
import { SCOPE, YOUTUBE_REDIRECT_URL } from '../../constants/constants'
import { Toaster } from 'react-hot-toast'
import styles from '../../styles/styles'
import './Destinations.css'
import { GetDestination } from '../../api/destination'
import checkError from '../../utils/checkError'
import toastErrorMessage from '../../utils/toastErrorMessage'
import { RemoveYt, YtAuthorize } from '../../api/youtube'
import { UpdateUser } from '../../api/user'
import { AuthorizeFB, RemoveFB } from '../../api/facebook'
import getUrlParams from '../../utils/getUrlParams'
import { useNavigate } from 'react-router'

/* global FB */

function Destinations() {
  const [youtubeAccessToken, setyoutubeAccessToken] = useState('')
  const [facebookAccessToken, setfacebookAccessToken] = useState('')

  const id = getCookie('userId')

  useEffect(() => {
    //get destinations auth

    GetDestination(id).then(({ data }) => {
      const { youtube_access_token, facebook_access_token } = data.msg

      setyoutubeAccessToken(youtube_access_token)
      setfacebookAccessToken(facebook_access_token)

    }).catch(err => {
      if (err?.response?.data?.err) {
        console.log(checkError(err?.response?.data?.msg));
      }
    })


    //youtube auth

    if (window.location.search.includes('code=')) {

      //  logic for Youtube
      let code = getUrlParams('code')

      youtubeAuth(id, code)

    } else {
      console.log('No code param in URL')
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


    //     // UpdateDestination({ id, youtubeAccessToken }).then(async () => {
    //     //  await UpdateUser({ youtubeAuthBool: true, id })
    //     //   .then(({ data }) => {
    //     //     //toastSuccessMessage(data.msg)
    //     //   }).catch(() => {
    //     //     //toastErrorMessage('Youtube authentication failed')
    //     //   })
    //     //   toastSuccessMessage('Youtube added as destination')
    //     // }).catch(() => {
    //     //   toastErrorMessage('Youtube not added as destination')
    //     // })

    //   }).catch((err) => {
    //     if (err?.response?.data?.err) {
    //       console.log(checkError(err?.response?.data?.msg));
    //     }
    //   })
  }



  const youtubeAuth = (id, code) => {

    YtAuthorize({ id, code }).then(async ({ data }) => {
      toastSuccessMessage("Youtube added as destination")

      await UpdateUser({ youtubeAuthBool: true, id })
        .then(({ data }) => {
          toastSuccessMessage(data.msg)
          // navigat('')
          location.href = "/destinations"

        }).catch(() => {
          toastErrorMessage('Youtube authentication failed')
        })


    }).catch(err => {
      toastErrorMessage('Youtube not added as destination')
    })

  }



  const facebookAuth = () => {

    FB.login(
      function (response) {

        let facebookAccessToken = response.authResponse.accessToken
        let facebookid = response.authResponse.userID

        AuthorizeFB({ id, facebookAccessToken, facebookid }).then(async ({ data }) => {
          await UpdateUser({ facebookAuthBool: true, id })
            .then(({ data }) => {
              //   toastSuccessMessage(data.msg)
              toastSuccessMessage("Facebook added as destination")
              document.location.reload()

            }).catch(() => {
              //   toastErrorMessage('Facebook authentication failed')
            })

        }).catch(() => {
          toastErrorMessage('Facebook not added as destination')
        })


      },
      { scope: 'email, publish_video, public_profile', auth_type: 'rerequest' }
    )
  }


  const removeFacebookDataFromDB = async (id) => {
    RemoveFB(id).then(async () => {
      fbLogoutUser()
    }).catch(() => {
      toastErrorMessage("something went wrong")
    })
  }

  const removeYoutubeDataFromDB = async (id) => {
    RemoveYt(id).then(res => {
      document.location.reload()
    }).catch(() => {
      toastErrorMessage("something went wrong")
    })
  }

  const fbLogoutUser = () => {
    FB.getLoginStatus(function (response) {
      if (response && response.status === 'connected') {
        FB.logout(function (response) {
          document.location.reload()
          //setfacebookAccessToken(true) 

        })
      }
    })
  }


  return (
    <>
      <Navbar />
      <Toaster position='top-center' reverseOrder={true} />

      <div className='destinations-outer-container'>
        <h2 className='destination-title'>Add a Destination</h2>
        <div className='destinations-container'>


          <Card
            id='youtube-destination'
            onClick={youtubeAuthClient}
            style={youtubeAccessToken ? styles.destinationSelected : null}
            cardTitleStyle={youtubeAccessToken ? { color: '#fff' } : null}
            title={'YouTube'}
            selected={youtubeAccessToken ? true : false}

            onRemoveHandler={(event) => {
              removeYoutubeDataFromDB(id)
              event.stopPropagation()
            }}

          >
            <img src="yt.svg" alt='youtube logo' />
          </Card>

          <Card
            id='facebook-destination'
            selected={facebookAccessToken ? true : false}
            style={facebookAccessToken ? styles.destinationSelected : null}
            cardTitleStyle={facebookAccessToken ? { color: '#fff' } : null}
            onClick={facebookAuth}

            onRemoveHandler={(event) => {
              removeFacebookDataFromDB(id)
              event.stopPropagation()
            }}

            title={'Facebook'}
          >
            <img src="fb.svg" alt='facebook logo' />
          </Card>



        </div>
      </div>
    </>
  )
}

export default Destinations
