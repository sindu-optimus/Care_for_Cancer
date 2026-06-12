import api from "./api";

export const searchPatients = (params) => api.get("/patients/search", { params });
export const createPatient  = (data)   => api.post("/patients", data);
export const updatePatient  = (id, data) => api.put(`/patients/${id}`, data);