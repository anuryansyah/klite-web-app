import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";

//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import { getProfile } from "slices/thunks";

const ProfileDropdown = () => {
  const profiledropdownData = createSelector(
    (state: any) => state.Profile.user,
    (user) => user
  );
  // Inside your component
  const user = useSelector(profiledropdownData);

  const dispatch: any = useDispatch();

  const [profile, setProfile] = useState({
    fullname: '',
    role: ''
  });

  const [userName, setUserName] = useState("");
  const authUser: any = localStorage.getItem("authUser");

  useEffect(() => {
    if (authUser) {
      dispatch(getProfile());
    }
  }, [authUser, dispatch]);

  useEffect(() => {
    const profile: any = localStorage.getItem('profile');

    if (profile) {
      const profileObj: any = JSON.parse(profile);
      // setProfile(user ?? profileObj);
      // setUserName(user.fullname.split(' ')[0])
      setProfile(profileObj);
      setUserName(profileObj.fullname.split(' ')[0])
    }
  }, [user]);

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <img className="rounded-circle header-profile-user" src={avatar1} alt="Header Avatar" />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{userName}</span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">{profile.role}</span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Selamat Datang {userName}!</h6>
          <DropdownItem className="p-0">
            <Link to="/profile" className="dropdown-item">
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Profile</span>
            </Link>
          </DropdownItem>
          <div className="dropdown-divider"></div>
          <DropdownItem className="p-0">
            <Link to="/logout" className="dropdown-item">
              <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
              <span className="align-middle" data-key="t-logout">
                Logout
              </span>
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
