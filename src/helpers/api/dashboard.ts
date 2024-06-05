import { APIClient } from "../api_helper";

const api = new APIClient();

const DashboardAPI = {
  get: (params?: any) => api.get('dashboard', params),
}

export default DashboardAPI;