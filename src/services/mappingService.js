import api from "./api";

export const getMappings          = ()         => api.get("/mdt-clinicians");
export const getMappingById       = (id)       => api.get(`/mdt-clinicians/${id}`);
export const createMapping        = (data)     => api.post("/mdt-clinicians", data);
export const updateMappings       = (clinicianId, data) => api.put( `/mdt-clinicians/clinicians/${clinicianId}/mappings`, data);
export const deleteMapping        = (clinicianId)       => api.delete(`/mdt-clinicians/clinicians/${clinicianId}/mappings`);
