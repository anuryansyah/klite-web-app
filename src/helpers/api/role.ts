import { APIClient } from "../api_helper";

const api = new APIClient();

const RoleAPI = {
  getList: (params?: any) => api.get('role/list', params),
}

export default RoleAPI;