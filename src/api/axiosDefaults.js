import axios from "axios";

axios.defaults.baseURL = "https://sewlot-07aa7e3364ec.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();