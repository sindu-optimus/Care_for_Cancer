import api from "./api";

export const loginApi = (data) => api.post("/login", data);