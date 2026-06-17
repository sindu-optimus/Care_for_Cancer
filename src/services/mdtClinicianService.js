import api from "./api";

export const getMappings          = ()         => api.get("/mdt-clinicians");
export const getMappingsByMDT = (mdtId) => api.get("/mdt-clinicians/mappings/by-mdt", {params: { mdtId }});
export const getMappingsByClinician = (clinicianId) => api.get("/mdt-clinicians/mappings", { params: { clinicianId }});
export const createMapping        = (data)     => api.post("/mdt-clinicians", data);
export const updateMappings       = (clinicianId, data) => api.put( `/mdt-clinicians/clinicians/${clinicianId}/mappings`, data);
export const deleteMapping        = (clinicianId)       => api.delete(`/mdt-clinicians/clinicians/${clinicianId}/mappings`);
