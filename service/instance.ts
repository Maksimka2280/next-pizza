import axios from "axios";

export const axiosInstance = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL, // NEXT_PUBLIC - обовязковий 
})


console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);