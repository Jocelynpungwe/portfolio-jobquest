import axios from 'axios'

const fetchCustome = axios.create({
  baseURL: '/api/v1',
})

export default fetchCustome
