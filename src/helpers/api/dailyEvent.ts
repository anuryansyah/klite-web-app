import { APIClient } from "../api_helper";

const api = new APIClient();

const DailyEventAPI = {
  getList: (params?: any) => api.get('daily-event/list', params),
  getDetail: (params?: any) => api.get('daily-event/detail', params),
  create: (payload?: any) => api.post('daily-event/create', payload),
  update: (params: any, payload: any) => api.put(`daily-event/update`, payload, { params }),
  delete: (params: any) => api.delete(`daily-event/delete`, { params }),
}

export default DailyEventAPI;