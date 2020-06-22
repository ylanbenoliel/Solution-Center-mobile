import axios from 'axios';

const url = 'https://7c44201f9e84.ngrok.io';
const api = axios.create({
  baseURL: url,
});

export { api, url };
