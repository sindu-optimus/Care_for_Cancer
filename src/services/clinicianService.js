import api from "./api";

export const getClinicians     = ()         => api.get("/clinicians");
export const getClinicianById  = (id)       => api.get(`/clinicians/${id}`);
export const createClinician   = (data)     => api.post("/clinicians", data);
export const updateClinician   = (id, data) => api.put(`/clinicians/${id}`, data);
export const deleteClinician   = (id)       => api.delete(`/clinicians/${id}`);