import { APIClient } from "../api_helper";

const api = new APIClient();

const SpecialEventAPI = {
  getList: (params?: any) => api.get('special-event/list', params),
  getDetail: (params?: any) => api.get('special-event/detail', params),
  create: (payload?: any) => api.post('special-event/create', payload),
  update: (params: any, payload: any) => api.put(`special-event/update`, payload, { params }),
  delete: (params: any) => api.delete(`special-event/delete`, { params }),
}

export default SpecialEventAPI;