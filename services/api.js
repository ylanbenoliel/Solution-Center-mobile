import axios from 'axios';

const url = 'https://cc6103e292dd.ngrok.io';
const api = axios.create({
  baseURL: url,
});

export { api, url };
