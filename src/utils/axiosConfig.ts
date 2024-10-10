import axios from "axios";

// Determine which API URL to use based on the environment
const apiUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN // Use production domain in production
    : process.env.NEXT_PUBLIC_DEVELOPMENT_DOMAIN; // Use development domain in development

console.log("API URL being used:", apiUrl);

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
