import axios from 'axios';

const url = 'https://solution-center.herokuapp.com';
const api = axios.create({
  baseURL: url,
  timeout: 6 * 1000,
});

export { api, url };
