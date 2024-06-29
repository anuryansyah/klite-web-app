import { APIClient } from "../api_helper";

const api = new APIClient();

const ScheduleAPI = {
  getList: (params?: any) => api.get('schedule/list', params),
  getListByUser: (params?: any) => api.get('schedule/list-by-user', params),
  getDetail: (params?: any) => api.get('schedule/detail', params),
  create: (payload?: any) => api.post('schedule/create', payload),
  update: (params: any, payload: any) => api.put(`schedule/update`, payload, { params }),
  delete: (params: any) => api.delete(`schedule/delete`, { params }),
  reset: (params: any) => api.delete(`schedule/reset`, { params }),
  sendNotification: (payload?: any) => api.post('schedule/send-notification', payload),
}

export default ScheduleAPI;