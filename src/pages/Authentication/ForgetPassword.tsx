import PropTypes from "prop-types";
import { useState } from "react";
import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Form, Spinner } from "reactstrap";

import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// import images
// import profile from "../../assets/images/bg.png";
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { WEB_TITLE } from "Components/constants/general";
import { postForgotPassword, postForgotPasswordConfirmation } from "helpers/api/auth";
import ButtonLoading from "Components/Common/ButtonLoading";

const ForgetPasswordPage = (props: any) => {
  const navigate = useNavigate();

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [hasSend, setHasSend] = useState({
    status: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirmation: ''
  })

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Tolong Masukan Email Anda"),
    }),
    onSubmit: (values) => {
      handleSendOtp(values);
    },
  });

  const handleSendOtp = async (data: any) => {
    setLoading(true);
    try {
      const res: any = await postForgotPassword(data);
      setHasSend({ status: res.status, message: res.message });
      setFormData(prev => ({ ...prev, username: data.username }));
      setLoading(false);
    } catch (err: any) {
      setError(err);
      setLoading(false);
    }
  };

  const getInputElement = (index: number): HTMLInputElement => {
    return document.getElementById("digit" + index + "-input") as HTMLInputElement;
  };
  const moveToNext = (index: any) => {
    if (getInputElement(index).value.length === 1) {
      if (index !== 6) {
        getInputElement(index + 1).focus();
      } else {
        getInputElement(index).blur();
      }
    }
  };

  const handleChange = (i: number, value: string) => {
    const newDigits = [...digits];
    newDigits[i] = value.toUpperCase();
    setDigits(newDigits);
  };

  const handleChangePassword = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleVerify = async () => {
    if (formData.password !== formData.passwordConfirmation) {
      setError('Passwords do not match');
      return
    }
    
    const data = {
      username: formData.username,
      securityCode: digits.join(''),
      password: formData.password
    };
    
    setLoading(true);
    try {
      await postForgotPasswordConfirmation(data)
      navigate('/login');
    } catch (err: any) {
      setError(err);
      setLoading(false);
    }
  };

  document.title = `Reset Password | ${WEB_TITLE}`;
  return (
    <ParticlesAuth>
      <div className="auth-page-content mt-lg-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link to="/" className="d-inline-block auth-logo">
                    <img src={logoLight} alt="" height="50" />
                  </Link>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <div className="mb-4">
                      <div className="avatar-lg mx-auto">
                        <div className="avatar-title bg-light text-primary display-5 rounded-circle">
                          <i className="ri-mail-send-line"></i>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-primary">Lupa Password?</h4>
                  </div>

                  <div className="text-center">
                    {hasSend.status && (
                      <Alert color="success" className="mt-3">
                        {hasSend.message}
                      </Alert>
                    )}
                    {error && (
                      <Alert color="danger" className="mt-3">
                        {error}
                      </Alert>
                    )}

                    <div className="text-muted text-center">
                      {!hasSend.status && <p>Tolong Masukan Email Anda</p>}
                      {hasSend.status && <p>Tolong masukan 6 digit code yang telah dikirimkan ke email Anda.</p>}
                    </div>
                  </div>

                  {!hasSend.status ? (
                    <div className="px-2">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <div className="mb-4">
                          <Input
                            name="username"
                            className="form-control"
                            placeholder="Masukan email"
                            type="email"
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

                        <div className="text-center mt-4">
                          <button className="btn btn-success w-100" disabled={loading} type="submit">
                            {loading ? <Spinner size="sm" className="me-2" /> : "Kirim Kode OTP"}
                          </button>
                        </div>
                      </Form>
                    </div>
                  ) : (
                    <div>
                      <Row>
                        <Col className="col-2">
                          <div className="mb-3">
                            <label htmlFor="digit1-input" className="visually-hidden">
                              Digit 1
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg bg-light border-light text-center p-0"
                              maxLength={1}
                              id="digit1-input"
                              value={digits[0]}
                              onKeyUp={() => moveToNext(1)}
                              onChange={(e) => handleChange(0, e.target.value)}
                            />
                          </div>
                        </Col>

                        <Col className="col-2">
                          <div className="mb-3">
                            <label htmlFor="digit2-input" className="visually-hidden">
                              Digit 2
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg bg-light border-light text-center p-0"
                              maxLength={1}
                              id="digit2-input"
                              value={digits[1]}
                              onKeyUp={() => moveToNext(2)}
                              onChange={(e) => handleChange(1, e.target.value)}
                            />
                          </div>
                        </Col>

                        <Col className="col-2">
                          <div className="mb-3">
                            <label htmlFor="digit3-input" className="visually-hidden">
                              Digit 3
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg bg-light border-light text-center p-0"
                              maxLength={1}
                              id="digit3-input"
                              value={digits[2]}
                              onKeyUp={() => moveToNext(3)}
                              onChange={(e) => handleChange(2, e.target.value)}
                            />
                          </div>
                        </Col>

                        <Col className="col-2">
                          <div className="mb-3">
                            <label htmlFor="digit4-input" className="visually-hidden">
                              Digit 4
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg bg-light border-light text-center p-0"
                              maxLength={1}
                              id="digit4-input"
                              value={digits[3]}
                              onKeyUp={() => moveToNext(4)}
                              onChange={(e) => handleChange(3, e.target.value)}
                            />
                          </div>
                        </Col>

                        <Col className="col-2">
                          <div className="mb-3">
                            <label htmlFor="digit5-input" className="visually-hidden">
                              Digit 5
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg bg-light border-light text-center p-0"
                              maxLength={1}
                              id="digit5-input"
                              value={digits[4]}
                              onKeyUp={() => moveToNext(5)}
                              onChange={(e) => handleChange(4, e.target.value)}
                            />
                          </div>
                        </Col>

                        <Col className="col-2">
                          <div className="mb-3">
                            <label htmlFor="digit6-input" className="visually-hidden">
                              Digit 6
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg bg-light border-light text-center p-0"
                              maxLength={1}
                              id="digit6-input"
                              value={digits[5]}
                              onKeyUp={() => moveToNext(6)}
                              onChange={(e) => handleChange(5, e.target.value)}
                            />
                          </div>
                        </Col>
                      </Row>
                      <div className="mb-3">
                        <Input
                          name="password"
                          className="form-control"
                          placeholder="Masukan password baru"
                          type="password"
                          value={formData.password}
                          onChange={handleChangePassword}
                        />
                      </div>
                      <div className="mb-3">
                        <Input
                          name="passwordConfirmation"
                          className="form-control"
                          placeholder="Masukan konfirmasi password"
                          type="password"
                          value={formData.passwordConfirmation}
                          onChange={handleChangePassword}
                        />
                      </div>
                      <div>
                        <ButtonLoading title="Konfirmasi" color="success" loading={loading} className="w-100" onClick={handleVerify} />
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">
                  Tunggu, saya ingat password saya...{" "}
                  <Link to="/login" className="fw-semibold text-primary text-decoration-underline">
                    {" "}
                    Click here{" "}
                  </Link>{" "}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);
