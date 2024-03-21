import { userForgetPasswordSuccess, userForgetPasswordError } from "./reducer"

import {
  postFakeForgetPwd,
  postJwtForgetPwd,
} from "../../../helpers/fakebackend_helper";

export const userForgetPassword = (user : any, history : any) => async (dispatch : any) => {
  try {
      let response;
      if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
          response = postJwtForgetPwd(
              user.email
          )
      } else {
          response = postFakeForgetPwd(
              user.email
          )
      }

      const data = await response;

      if (data) {
          dispatch(userForgetPasswordSuccess(
              "Reset link are sended to your mailbox, check there first"
          ))
      }
  } catch (forgetError) {
      dispatch(userForgetPasswordError(forgetError))
  }
}