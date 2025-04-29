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
  baseURL: "http://localhost:8080",
  //import.meta.env.VITE_API_URL
  withCredentials: true,
});

export default axiosInstance;
