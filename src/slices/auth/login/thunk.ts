//Include Both Helper File with needed methods
import { postJwtLogin } from "../../../helpers/fakebackend_helper";

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag, setLoading } from './reducer';
import { postLogin } from "helpers/api/auth";
import { setAuthorization } from "helpers/api_helper";

export const loginUser = (user : any, history : any) => async (dispatch : any) => {
  try {
    dispatch(setLoading(true));
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

    let data: any = await response;
    
    if (data) {
      localStorage.setItem("authUser", JSON.stringify(data));
      localStorage.setItem("verify", JSON.stringify(data.verify));
      setAuthorization(data?.token);
      dispatch(loginSuccess(data));
      history('/dashboard');
    }
  } catch (error: any) {
    dispatch(apiError(error));
  }
};  

export const logoutUser = () => async (dispatch : any) => {
  try {
    localStorage.removeItem("authUser");
    localStorage.removeItem("verify");
    localStorage.removeItem("profile");
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
    console.log(error);
    
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