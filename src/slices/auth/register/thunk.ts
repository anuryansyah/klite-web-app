//Include Both Helper File with needed methods
import { postRegister } from "helpers/api/auth";
import {
  postFakeRegister,
  postJwtRegister,
} from "../../../helpers/fakebackend_helper";

// action
import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
  // apiErrorChange
} from "./reducer";

// Is user register successfull then direct plot user in redux.
export const registerUser = (user : any) => async (dispatch : any) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = postJwtRegister('/post-jwt-register', user);
      // yield put(registerUserSuccessful(response));
    } else if (process.env.REACT_APP_API_URL) {
      response = postRegister({
        username: user.username,
        fullname: user.fullname,
        phoneNumber: user.phoneNumber,
        password: user.password,
      });
      const data : any = await response;

      if (data) {
        dispatch(registerUserSuccessful(data));
      }
    }
  } catch (error : any) {
    dispatch(registerUserFailed(error.details[0].message));
  }
};

export const resetRegisterFlag = () => {
  try {
    const response = resetRegisterFlagChange();
    return response;
  } catch (error) {
    return error;
  }
};

// export const apiError = () => async (dispatch : any) => {
//   try {
//     const response = dispatch(apiErrorChange(false));
//     return response;
//   } catch (error) {
//     return error;
//   }
// };