import api from "./api";

export const getInvestigations = () => api.get("/investigations");
export const getInvestigationCatalogues = (id) => api.get(`/catalogues/investigation/${id}`);
export const createPatientInvestigationMDT = (data) => api.post("/patient-investigate-mdt", data);
export const getPatientInvestigationMDT = () => api.get("/patient-investigate-mdt");