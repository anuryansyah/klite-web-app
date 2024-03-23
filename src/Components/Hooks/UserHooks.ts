import { useEffect, useState } from "react";
import { getLoggedinUser } from "../../helpers/api_helper";

const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  var token =
  userProfileSession &&
  userProfileSession["token"];
  const [loading, setLoading] = useState(userProfileSession ? false : true);
  const [userProfile, setUserProfile] = useState(
    userProfileSession ? userProfileSession : null
  );

  const verifyUser = localStorage.getItem("verify");
  let verify;
  if (verifyUser !== null) {
    verify = JSON.parse(verifyUser);
  }

  useEffect(() => {
    const userProfileSession = getLoggedinUser();
    var token =
      userProfileSession &&
      userProfileSession["token"];
    setUserProfile(userProfileSession ? userProfileSession : null);
    setLoading(token ? false : true);
    // verify = userProfileSession && userProfileSession["verify"];
    
  }, []);


  return { userProfile, loading, token, verify };
};

export { useProfile };