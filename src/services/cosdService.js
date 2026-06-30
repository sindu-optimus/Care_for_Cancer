import api from "./api";

export const getCosdValues = (cosdDataId) => api.get("/cosd-values", { params: { cosd_data_id: cosdDataId,},});