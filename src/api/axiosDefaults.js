import axios from "axios";

axios.defaults.baseURL = "https://sew-api-6d5f4cb2934c.herokuapp.com";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();