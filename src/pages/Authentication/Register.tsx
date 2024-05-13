import React, { useEffect, useState } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback, Button, Spinner } from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// action
import { registerUser, resetRegisterFlag } from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

//import images
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from "reselect";
import { WEB_TITLE } from "Components/constants/general";

const Register = () => {
  const history = useNavigate();
  const dispatch: any = useDispatch();

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: "",
      fullname: "",
      phoneNumber: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your Email"),
      fullname: Yup.string().required("Please Enter Your Full Name"),
      phoneNumber: Yup.string().required("Please Enter Your Phone Number").matches(phoneRegExp, 'Phone number is not valid').max(13),
      password: Yup.string().required("Please Enter Your Password"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      dispatch(registerUser(values));
    },
  });

  const selectLayoutState = (state: any) => state;
  const registerdatatype = createSelector(selectLayoutState, (state) => ({
    success: state.Account.success,
    error: state.Account.error,
    loading: state.Login.loading,
    registrationError: state.Login.registrationError,
  }));
  // Inside your component
  const { error, success, loading } = useSelector(registerdatatype);

  useEffect(() => {
    if (success) {
      setTimeout(() => history("/login"), 3000);
    }

    setTimeout(() => {
      dispatch(resetRegisterFlag());
    }, 3000);
  }, [dispatch, success, error, history]);

  document.title = `Register | ${WEB_TITLE}`;

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content mt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="20" />
                    </Link>
                  </div>
                  <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Create New Account</h5>
                      <p className="text-muted">Get your free velzon account now</p>
                    </div>
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        className="needs-validation"
                        action="#"
                      >
                        {success && success ? (
                          <>
                            {toast("Your Redirect To Login Page...", { position: "top-right", hideProgressBar: false, className: "bg-success text-white", progress: undefined, toastId: "" })}
                            <ToastContainer autoClose={2000} limit={1} />
                            <Alert color="success">Register User Successfully and Your Redirect To Login Page...</Alert>
                          </>
                        ) : null}

                        {error && error ? (
                          <Alert color="danger">
                            <div>Email has been Register Before, Please Use Another Email Address... </div>
                          </Alert>
                        ) : null}

                        <div className="mb-3">
                          <Label htmlFor="username" className="form-label">
                            Email <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="username"
                            name="username"
                            className="form-control"
                            placeholder="Enter email address"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.username || ""}
                            invalid={validation.touched.username && validation.errors.username ? true : false}
                          />
                          {validation.touched.username && validation.errors.username ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.username}</div>
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="fullname" className="form-label">
                            Full Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="fullname"
                            type="text"
                            placeholder="Enter full name"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.fullname || ""}
                            invalid={validation.touched.fullname && validation.errors.fullname ? true : false}
                          />
                          {validation.touched.fullname && validation.errors.fullname ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.fullname}</div>
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="phoneNumber" className="form-label">
                            Phone Number <span className="text-danger">*</span>
                          </Label>
                          <Input 
                            name="phoneNumber"
                            type="text" 
                            className="form-control"
                            pattern="[0-9]*"
                            placeholder="Enter Your Phone Number" 
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.phoneNumber || ""}
                            invalid={validation.touched.phoneNumber && validation.errors.phoneNumber ? true : false}
                          />
                          {validation.touched.phoneNumber && validation.errors.phoneNumber ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.phoneNumber}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="userpassword" className="form-label">
                            Password <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="password"
                            type="password"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={validation.touched.password && validation.errors.password ? true : false}
                          />
                          {validation.touched.password && validation.errors.password ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.password}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-2">
                          <Label htmlFor="confirmPassword" className="form-label">
                            Confirm Password <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="confirm_password"
                            type="password"
                            placeholder="Confirm Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.confirm_password || ""}
                            invalid={validation.touched.confirm_password && validation.errors.confirm_password ? true : false}
                          />
                          {validation.touched.confirm_password && validation.errors.confirm_password ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.confirm_password}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mt-4">
                          <Button color="success" className="w-100" type="submit" disabled={loading && true}>
                            {loading && (
                              <Spinner size="sm" className="me-2">
                                {" "}
                                Loading...{" "}
                              </Spinner>
                            )}
                            Register
                          </Button>
                        </div>

                      </Form>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Already have an account ?{" "}
                    <Link to="/login" className="fw-semibold text-primary text-decoration-underline">
                      {" "}
                      Login{" "}
                    </Link>{" "}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Register;
