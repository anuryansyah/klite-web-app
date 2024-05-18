import { APIClient } from "../api_helper";

import * as url from "../url_helper";

const api = new APIClient();

const UserAPI = {
  getProfile: (data?: any) => api.get(url.GET_PROFILE, data),
  getMenuAccess: (data?: any) => api.get(url.GET_MENU_ACCESS, data),
  getList: (data?: any) => api.get('user/list', data),
  create: (data?: any) => api.post('user/create', data),
  update: (data?: any) => api.put(url.PUT_EDIT_PROFILE, data),
  updatePassword: (payload: any, params: any) => api.put(`user/change-password`, payload, { params }),
}

export default UserAPI;