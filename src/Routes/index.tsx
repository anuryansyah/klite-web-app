import React from "react";
import { Routes, Route } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { authProtectedRoutes, authVerifyRoutes, publicRoutes } from "./allRoutes";
import AuthProtected from "./AuthProtected";
import AuthVerify from "./AuthVerify";

const Index = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route>
          {publicRoutes.map((route, idx) => (
            <Route path={route.path} element={<NonAuthLayout>{route.component}</NonAuthLayout>} key={idx} />
          ))}
        </Route>

        <Route>
          {authVerifyRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <AuthVerify>
                  <NonAuthLayout>{route.component}</NonAuthLayout>
                </AuthVerify>
              }
              key={idx}
            />
          ))}
        </Route>

        <Route>
          {authProtectedRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <AuthProtected>
                  <VerticalLayout>{route.component}</VerticalLayout>
                </AuthProtected>
              }
              key={idx}
            />
          ))}
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default Index;
