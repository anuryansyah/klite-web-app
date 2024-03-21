//Include Both Helper File with needed methods
import { postJwtLogin } from "../../../helpers/fakebackend_helper";

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';
import { postLogin } from "helpers/api/auth";
import { setAuthorization } from "helpers/api_helper";

export const loginUser = (user : any, history : any) => async (dispatch : any) => {
  try {
    let response;
    if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = postJwtLogin({
        email: user.email,
        password: user.password
      });
    } else if (process.env.REACT_APP_DEFAULTAUTH) {
      response = postLogin({
        username: user.email,
        password: user.password,
      });
    }

    var data: any = await response;
    
    if (data) {
      localStorage.setItem('authUser', JSON.stringify(data));
      setAuthorization(data?.token);
      dispatch(loginSuccess(data));
      history('/dashboard')
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch : any) => {
  try {
    localStorage.removeItem("authUser");
    dispatch(logoutUserSuccess(true));
    
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type : any, history : any) => async (dispatch : any) => {
  try {
    let response;      
    const socialdata = await response;
    if (socialdata) {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history('/dashboard')
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch : any) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};