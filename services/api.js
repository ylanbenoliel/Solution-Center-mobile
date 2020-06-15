import axios from 'axios';

const url = 'http://192.168.0.5:3333';
const api = axios.create({
  baseURL: url,
});

export { api, url };
