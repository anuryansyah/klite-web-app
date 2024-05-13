import { APIClient } from "../api_helper";

import * as url from "../url_helper";

const api = new APIClient();

export const getUserProfile = (data?: any) => api.get(url.GET_PROFILE, data);
export const getMenuAccess = (data?: any) => api.get(url.GET_MENU_ACCESS, data);

