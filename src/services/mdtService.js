import api from "./api";

export const getMDTs      = ()         => api.get("/mdts");
export const getMDTById   = (id)       => api.get(`/mdts/${id}`);
export const createMDT    = (data)     => api.post("/mdts", data);
export const updateMDT    = (id, data) => api.put(`/mdts/${id}`, data);
export const deleteMDT    = (id)       => api.delete(`/mdts/${id}`);