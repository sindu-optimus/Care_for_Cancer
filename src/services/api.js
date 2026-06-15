import axios from "axios";

const api = axios.create({
  baseURL: "http://13.40.57.192:8080/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("ERROR", error);
    console.log("RESPONSE", error.response);

    return Promise.reject(error);
  }
);

export default api;