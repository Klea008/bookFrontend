import axios from "axios";

const axiosInstance = axios.create({
     baseURL: "https://db-book.vercel.app",
     withCredentials:true
})

export default axiosInstance;