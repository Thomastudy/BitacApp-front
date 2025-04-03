import axios from "axios";
import { URL_link } from "./URL";

export default axios.create({
  baseURL: URL_link,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
