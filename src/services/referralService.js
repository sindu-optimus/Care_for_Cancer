import api from "./api";

export const getReferralsByPatientId = (patientId) => api.get("/referrals", { params: { patientId } });