import axios from "axios";

const url = "http://10.0.2.2:3333"
const api = axios.create({
  baseURL: url,
});

export { api, url };
