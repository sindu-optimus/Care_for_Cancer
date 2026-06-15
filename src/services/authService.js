import api from "./api";

export const loginApi = (data) => api.post("/login", data);

export const refreshTokenApi = (refreshToken) => api.post("/login/refresh", { refreshToken });
