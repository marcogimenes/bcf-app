import axios from 'axios';
import { API_URL } from '../constants/env';

const Api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Api;
