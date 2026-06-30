import api from "./api";

export const getReferrals = (params = {}) => api.get("/referrals", { params });

//referral types API
export const getReferralsTypes = () => api.get("/referral-types");