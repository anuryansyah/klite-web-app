import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Button, Alert } from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

//import images
import logoLight from "../../assets/images/logo-light.png";
import { USER_STATUS, WEB_TITLE } from "Components/constants/general";
import ButtonLoading from "Components/Common/ButtonLoading";
import { postSendConfirmation, postSendEmailVerify } from "helpers/api/auth";

const Verify = () => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [hasSend, setHasSend] = useState({
    status: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      const res: any = await postSendEmailVerify({});
      setHasSend({ status: res.status, message: res.message });
      setLoading(false);
    } catch (err: any) {
      setError(err);
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const data = { securityCode: digits.join('') };
    
    setLoading(true);
    try {
      await postSendConfirmation(data);
      localStorage.setItem("verify", JSON.stringify(USER_STATUS.ACTIVE));
      window.location.reload();
    } catch (err: any) {
      setError(err);
      setLoading(false);
    }
  };

  document.title = `Two Step Verification | ${WEB_TITLE}`;
  return (
    <React.Fragment>
      <div className="auth-page-wrapper">
        <ParticlesAuth>
          <div className="auth-page-content">
            <Container>
              <Row>
                <Col lg={12}>
                  <div className="text-center mt-sm-5 mb-4 text-white-50">
                    <div>
                      <Link to="/dashboard" className="d-inline-block auth-logo">
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
                      <div className="mb-4">
                        <div className="avatar-lg mx-auto">
                          <div className="avatar-title bg-light text-primary display-5 rounded-circle">
                            <i className="ri-mail-line"></i>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-muted text-center mb-4">
                          <h4 className="">Verify Your Email</h4>
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
                          {hasSend.status && <p>Please enter the 6 digit code sent to your email</p>}
                        </div>

                        {!hasSend.status ? (
                          <div className="mt-3">
                            <ButtonLoading title="Send Verification Code" color="success" loading={loading} className="w-100" onClick={handleSendEmail} />
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
                            <div className="mt-3">
                              <ButtonLoading title="Confirm" color="success" loading={loading} className="w-100" onClick={handleVerify} />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                  {hasSend.status && (
                    <div className="mt-4 text-center">
                      <p className="mb-0">
                        Didn't receive a code ?{" "}
                        <span onClick={handleSendEmail} className="fw-semibold text-primary text-decoration-underline cursor-pointer">
                          Resend
                        </span>{" "}
                      </p>
                    </div>
                  )}
                </Col>
              </Row>
            </Container>
          </div>
        </ParticlesAuth>
      </div>
    </React.Fragment>
  );
};

export default Verify;
