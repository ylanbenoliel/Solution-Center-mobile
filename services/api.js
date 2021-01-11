import axios from 'axios';

// eslint-disable-next-line import/extensions
import { APP_URL } from '../env.js';

const url = APP_URL;
const api = axios.create({
  baseURL: url,
  timeout: 6 * 1000,
});

export { api, url };
