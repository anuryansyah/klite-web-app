import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch } from "react-redux";
import { isExpired } from "react-jwt";

import { useProfile } from "../Components/Hooks/UserHooks";

import { logoutUser } from "../slices/auth/login/thunk";

const AuthVerify = (props: any) => {
  const dispatch: any = useDispatch();
  const { userProfile, loading, token, verify } = useProfile();

  const isTokenExpired = token ? isExpired(token) : true;

  useEffect(() => {
    if (userProfile && !loading && token && !isTokenExpired) {
      setAuthorization(token);
    } else if ((!userProfile && loading && !token) || isTokenExpired) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  if (verify) {
    return <Navigate to={{ pathname: "/dashboard" }} />;
  }

  /*
  Navigate is un-auth access protected routes via url
  */

  if ((!userProfile && loading && !token) || isTokenExpired) {
    return <Navigate to={{ pathname: "/login" }} />;
  }

  return <>{props.children}</>;
};

export default AuthVerify;
