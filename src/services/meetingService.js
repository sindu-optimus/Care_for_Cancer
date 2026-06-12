import api from "./api";

export const getMDTMeetings      = ()         => api.get("/mdt-meetings");
export const getMDTMeetingsById   = (id)       => api.get(`/mdt-meetings/${id}`);
export const createMDTMeetings    = (data)     => api.post("/mdt-meetings", data);
export const updateMDTMeetings    = (id, data) => api.put(`/mdt-meetings/${id}`, data);
export const deleteMDTMeetings    = (id)       => api.delete(`/mdt-meetings/${id}`); 