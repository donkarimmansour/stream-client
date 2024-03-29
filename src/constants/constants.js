export const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl'

export const DISCOVERY =
  'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'

export const YOUTUBE_REDIRECT_URL = 'https://localhost:3000/destinations'

export const YOUTUBE_PRIVACY_POLICY = [
  { value: 'Private', label: 'Private' },
  { value: 'Public', label: 'Public' },
  { value: 'Unlisted', label: 'Unlisted' },
]

export const CAPTURE_OPTIONS_USER_FACING = {
  audio: true,
  video: {
    height: { min: 720, max: 1280 },
    width: { min: 1080, max: 1920 },
    frameRate: { min: 15, ideal: 24, max: 30 },
    facingMode: 'user',
  },
}

export const CAPTURE_OPTIONS_RECORD_SCREEN = {
  audio: true,
  video: {
    height: 1080,
    width: 1920,
    frameRate: { ideal: 24, max: 30 },
  },
}

export const captureOptions = (CAPTURE_OPTIONS) => {
  const isMobile = navigator.userAgentData.mobile //resolves true/false
  console.log('isMobile: ', isMobile)
  if (!isMobile) {
    return CAPTURE_OPTIONS
  }
}
