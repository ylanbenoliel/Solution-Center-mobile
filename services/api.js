import axios from 'axios';

const url = 'https://e5861032da71.ngrok.io';
const api = axios.create({
  baseURL: url,
});

export { api, url };
