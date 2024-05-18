import React, { useEffect, useState } from "react";

import { Container, Row, Col, Card, CardBody, Label, Input, CardHeader, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";

import progileBg from "../../assets/images/auth-one-bg.jpg";
import avatar from "../../assets/images/users/avatar-1.jpg";
import { WEB_TITLE } from "Components/constants/general";
import ButtonLoading from "Components/Common/ButtonLoading";
import UserAPI from "helpers/api/user";

import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { ToastContainer, toast } from "react-toastify";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("1");

  const tabChange = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    fullname: "",
    role: "",
    username: "",
    phoneNumber: "",
  });

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    phoneNumber: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const getDetail = async () => {
    await UserAPI.getProfile()
      .then((res: any) => {
        setProfile(res);
        setFormData(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDetail();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmitProfile = async () => {
    const payload = {
      username: formData.username,
      fullname: formData.fullname,
      phoneNumber: formData.phoneNumber,
    };

    setLoading(true);

    await UserAPI.update(payload)
      .then((res: any) => {
        window.location.reload();
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmitPassword = async () => {
    const payload = {
      password: formData.password,
      newPassword: formData.newPassword,
    };

    if (formData.confirmNewPassword === formData.newPassword) {
      setLoading(true);
      await UserAPI.updatePassword(payload, {})
        .then((res: any) => {
          toast(res.message, { position: "top-right", hideProgressBar: true, className: 'bg-success text-white' });
        })
        .catch((err) => {
          console.log(err);
          toast(err, { position: "top-right", hideProgressBar: true, className: 'bg-danger text-white' });
        });
    } else {
      toast("Konfirmasi Password tidak sesuai", { position: "top-right", hideProgressBar: true, className: 'bg-danger text-white' });
    }
    
    setLoading(false);
  };

  document.title = `Profile | ${WEB_TITLE}`;
  return (
    <React.Fragment>
      <div className="page-content mt-lg-5">
        <Container fluid>
          <div className="position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg profile-setting-img">
              <img src={progileBg} className="profile-wid-img" alt="" />
            </div>
          </div>

          <Row>
            <Col xxl={3}>
              <Card className="mt-n5">
                <CardBody className="p-4">
                  <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                      <img src={avatar} className="rounded-circle avatar-xl img-thumbnail user-profile-image" alt="user-profile" />
                    </div>
                    <h5 className="fs-16 mb-1">{profile.fullname}</h5>
                    <p className="text-muted mb-0">{profile.role}</p>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xxl={9}>
              <Card className="mt-xxl-n5">
                <CardHeader>
                  <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames("text-body", { active: activeTab === "1" })}
                        onClick={() => {
                          tabChange("1");
                        }}
                        type="button"
                      >
                        Data Personal
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames("text-body", { active: activeTab === "2" })}
                        onClick={() => {
                          tabChange("2");
                        }}
                        type="button"
                      >
                        Ubah Password
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>
                <CardBody className="p-4">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Row>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Label className="form-label">Nama Lengkap</Label>
                            <Input name="fullname" value={formData.fullname} type="text" className="form-control" onChange={handleChange} />
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Label className="form-label">Email</Label>
                            <Input name="username" value={formData.username} type="email" className="form-control" onChange={handleChange} />
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Label className="form-label">No. Handphone</Label>
                            {/* <Input name="phoneNumber" value={formData.phoneNumber} type="tel" className="form-control" onChange={handleChange} /> */}
                            <PhoneInput 
                              defaultCountry="id" 
                              value={formData.phoneNumber} 
                              onChange={(phone) => setFormData((prev: any) => ({ ...prev, phoneNumber: phone }))}
                              hideDropdown={true} 
                              inputClassName="form-control py-2"
                            />
                          </div>
                        </Col>
                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <ButtonLoading title="Ubah" color="primary" loading={loading} className="btn-soft-primary" onClick={handleSubmitProfile} />
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2">
                      <Row>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Label className="form-label">Password Lama</Label>
                            <Input 
                              type="password" 
                              className="form-control" 
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                            />
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Label className="form-label">Password Baru</Label>
                            <Input 
                              type="password" 
                              className="form-control" 
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                            />
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Label className="form-label">Konfirmasi Password Baru</Label>
                            <Input 
                              type="password" 
                              className="form-control" 
                              name="confirmNewPassword"
                              value={formData.confirmNewPassword}
                              onChange={handleChange}
                            />
                          </div>
                        </Col>
                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <ButtonLoading title="Ubah" color="primary" loading={loading} className="btn-soft-primary" onClick={handleSubmitPassword} />
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
