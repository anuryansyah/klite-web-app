import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard";

// //login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import Verify from "../pages/Authentication/Verify";

// // User Profile
import UserProfile from "../pages/Authentication/user-profile";

// User
import UserPage from "../pages/User"


const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },
  
  // User
  { path: "/user", component: <UserPage /> },
  
  // //Verify User
  // { path: "/verify", component: <Verify /> },
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const authVerifyRoutes = [
  { path: "/verify", component: <Verify /> },
]

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
  // { path: "/verify", component: <Verify /> },
];

export { authProtectedRoutes, publicRoutes, authVerifyRoutes };