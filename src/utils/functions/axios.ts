import axios from 'axios';
import { PUBLIC_BASE_URL } from '../constants/api';

export const publicInstance = axios.create({
  baseURL: PUBLIC_BASE_URL,
  headers: {
    'Content-type': 'application/json',
  },
});
