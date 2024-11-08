import { APIClient } from "../api_helper";

import * as url from "../url_helper";

const api = new APIClient();

// Login Method
export const postLogin = (data : any) => api.post(url.POST_LOGIN, data);
export const postRegister = (data : any) => api.post(url.POST_REGISTER, data);
export const postSendEmailVerify = (data : any) => api.post(url.POST_VERIVY_EMAIL, data);
export const postSendConfirmation= (data : any) => api.post(url.POST_VERIVY_CONFIRMATION, data);
export const postForgotPassword = (data : any) => api.post(url.POST_FORGOT_PASSWORD, data);
export const postForgotPasswordConfirmation = (data : any) => api.post(url.POST_FORGOT_PASSWORD_CONFIRMATION, data);

