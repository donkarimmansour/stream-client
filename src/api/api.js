import axios from 'axios'

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://localhost:3001/v1/api'
    : 'https://localhost:3001/v1/api'

const API = axios.create({
  baseURL,
})

export default API
