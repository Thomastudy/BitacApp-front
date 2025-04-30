// import axios from "axios";
// import { URL_link } from "./URL";

// export default axios.create({
//   baseURL: URL_link,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
